"""Create synthetic report fixtures for visual QA, outside tracked source files."""
from pathlib import Path
import sys

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app import Store, pdf_report, report_data, word_report

root=Path(__file__).resolve().parents[1]
output=root/"test-output"
output.mkdir(exist_ok=True)
store=Store(output/"report-ledger")
if not store.snapshot()["transactions"]:
    store.save_settings({"owner":"Example Creator"})
    samples=[
        {"date":"2026-10-01","type":"income","name":"Example affiliate payout","source":"ShopMy","category":"Affiliate commission","amount":"500","fees":"20","refunds":"10"},
        {"date":"2026-10-03","type":"expense","name":"Example art vendor","source":"Olivia Rose James · Royals","category":"Artwork & content purchases","amount":"150","business_percent":60,"campaign":"Royals · Example painting","notes":"Sample purchase for a promotional video. Preparer to review business use and tax treatment.","tax_review":True},
        {"date":"2026-10-15","type":"income","name":"Example Royals campaign","source":"Olivia Rose James · Royals","category":"Sponsored content","amount":"200","campaign":"Royals · Example painting"},
        {"date":"2026-10-16","type":"expense","name":"Example Café & Co.","category":"Software & subscriptions","amount":"24.99","business_percent":100,"notes":"Synthetic subscription payment. Not an actual expense."},
    ]
    for item in samples:store.save_transaction(item)
report=report_data(store,"2026-10-01","2026-12-31")
(output/"sample-report.pdf").write_bytes(pdf_report(report))
(output/"sample-report.docx").write_bytes(word_report(report))
print("Synthetic PDF and Word reports saved in test-output.")
