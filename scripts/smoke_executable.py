"""Exercise the standalone Windows binary with an isolated synthetic ledger."""
import base64
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import urllib.request
import zipfile

root=Path(__file__).resolve().parents[1]
binary=Path(sys.argv[1] if len(sys.argv)>1 else root/"dist/LeahsLedger.exe").resolve()
test_root=root/".test-data"
test_root.mkdir(exist_ok=True)
with tempfile.TemporaryDirectory(dir=test_root) as folder:
    data=Path(folder)
    process=subprocess.Popen([str(binary),"--no-window","--data-dir",str(data)],creationflags=getattr(subprocess,"CREATE_NO_WINDOW",0))
    try:
        for _ in range(300):
            if (data/"active.json").exists():break
            if process.poll() is not None:raise RuntimeError(f"App exited early: {process.returncode}")
            time.sleep(.1)
        else:raise RuntimeError("App did not start within 30 seconds")
        address=json.loads((data/"active.json").read_text())["url"]
        origin,token=address.split('/#token=')
        def request(path,payload=None):
            headers={"X-Ledger-Token":token}
            body=None
            if payload is not None:
                headers["Content-Type"]="application/json"
                body=json.dumps(payload).encode()
            with urllib.request.urlopen(urllib.request.Request(origin+path,data=body,headers=headers),timeout=40) as response:
                return response.read(),response.headers.get("Content-Type")
        request('/api/transactions',{"type":"income","date":"2026-10-22","name":"Synthetic payer","source":"ShopMy","category":"Affiliate commission","amount":"100.00","fees":"5.00"})
        request('/api/transactions',{"type":"expense","date":"2026-10-22","name":"Synthetic vendor","category":"Content supplies","amount":"25.00","business_percent":50})
        request('/api/documents',{"name":"synthetic-statement.txt","base64":base64.b64encode(b"Synthetic statement only").decode(),"kind":"Bank statement","tax_year":2026})
        for format in ('pdf','docx','csv','zip'):
            contents,mime=request('/api/report?start=2026-01-01&end=2026-12-31&format='+format)
            if format=='pdf':assert contents.startswith(b'%PDF-')
            if format in ('docx','zip'):
                with zipfile.ZipFile(io.BytesIO(contents)) as archive:
                    assert not archive.testzip()
                    if format=='zip':assert any(name.startswith('Documents/') for name in archive.namelist())
            if format=='csv':assert b'Synthetic payer' in contents
            print(f"Standalone {format.upper()} export: OK")
        backup,_=request('/api/backup')
        req=urllib.request.Request(origin+'/api/restore',data=backup,headers={"X-Ledger-Token":token,"Content-Type":"application/zip"})
        with urllib.request.urlopen(req,timeout=40) as response:assert json.load(response)['restored']
        contents,_=request('/api/state')
        assert len(json.loads(contents)['transactions'])==2
        print("Standalone ledger, document storage, backup and restore: OK")
        request('/api/shutdown',{})
        process.wait(timeout=15)
        assert process.returncode==0
        print("Standalone shutdown: OK")
    finally:
        if process.poll() is None:process.terminate();process.wait(timeout=10)
