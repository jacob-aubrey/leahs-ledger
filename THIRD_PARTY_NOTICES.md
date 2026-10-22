# Third-party software

The Windows executable bundles Python and its standard library, ReportLab, python-docx, and the runtime dependencies collected by PyInstaller, including lxml, Pillow, and typing_extensions where required. PyInstaller’s bootloader exception permits distribution of applications built with it.

These components retain their own copyrights and licenses. License texts from the installed distributions are collected into `third-party-licenses.zip` for the Windows release. This file should accompany redistribution of the executable.

The app uses Microsoft Edge and Windows fonts already present on the PC; it does not distribute Edge or those fonts. The included ledger icon and interface icons are original geometric artwork defined in this repository. No brand logos or artist images are distributed.
