"""Collect redistributable dependency licenses for a release built on this PC."""
from importlib import metadata
from pathlib import Path
import sys
import zipfile

root=Path(__file__).resolve().parents[1]
target=root/"dist"
target.mkdir(exist_ok=True)
names=("reportlab","python-docx","lxml","Pillow","typing_extensions","charset-normalizer","pyinstaller","pyinstaller-hooks-contrib","altgraph","packaging","pefile","pywin32-ctypes","setuptools")
with zipfile.ZipFile(target/"third-party-licenses.zip","w",zipfile.ZIP_DEFLATED) as archive:
    index=[]
    for name in names:
        try:dist=metadata.distribution(name)
        except metadata.PackageNotFoundError:continue
        index.append(f"{dist.metadata['Name']} {dist.version}")
        for entry in dist.files or []:
            if any(part.lower().startswith(("license","copying","notice","authors")) for part in entry.parts):
                source=Path(dist.locate_file(entry))
                if source.is_file():archive.write(source,str(Path(name)/Path(*entry.parts[-3:])))
    archive.writestr("COMPONENTS.txt","\n".join(index))
    for folder in (Path(sys.base_prefix),Path(sys.base_prefix)/"Lib",Path(sys.base_prefix)/"Doc"):
        for name in ("LICENSE.txt","LICENSE","LICENSE.rst"):
            source=folder/name
            if source.is_file():
                archive.write(source,"Python/"+name)
                break
    archive.write(root/"LICENSE","LeahsLedger/LICENSE.txt")
print("Release dependency licenses collected.")
