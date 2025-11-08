// merge_pdf.js
// Client-side PDF merging using PDF-Lib.
(function () {
  const input = document.getElementById('inputFiles');
  const mergeBtn = document.getElementById('mergeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const fileList = document.getElementById('fileList');
  const status = document.getElementById('status');
  const downloadLink = document.getElementById('downloadLink');

  function renderFileList(files) {
    if (!files || files.length === 0) {
      fileList.textContent = 'No files selected.';
      return;
    }
    const names = Array.from(files).map((f, i) => `${i+1}. ${f.name}`);
    fileList.textContent = names.join('\n');
  }

  input.addEventListener('change', () => {
    renderFileList(input.files);
    downloadLink.style.display = 'none';
    status.textContent = '';
  });

  clearBtn.addEventListener('click', () => {
    input.value = null;
    renderFileList([]);
    downloadLink.style.display = 'none';
    status.textContent = '';
  });

  mergeBtn.addEventListener('click', async () => {
    const files = input.files;
    if (!files || files.length < 1) {
      status.textContent = 'Please choose at least one PDF file.';
      return;
    }

    mergeBtn.disabled = true;
    status.textContent = 'Merging PDFs — please wait...';

    try {
      const mergedPdf = await PDFLib.PDFDocument.create();

      // Load each PDF and copy pages
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((p) => mergedPdf.addPage(p));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      downloadLink.style.display = 'inline-block';
      downloadLink.href = url;
      downloadLink.download = 'merged.pdf';
      downloadLink.textContent = 'Download merged PDF';

      status.textContent = `Merged ${files.length} file(s). Click the download link.`;
    } catch (err) {
      console.error(err);
      status.textContent = 'An error occurred while merging PDFs. See console for details.';
    } finally {
      mergeBtn.disabled = false;
    }
  });

  // initial render
  renderFileList([]);
})();
