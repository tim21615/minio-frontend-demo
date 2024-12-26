document.addEventListener("DOMContentLoaded", function () {
    var fileInput = document.getElementById("fileInput");
    var uploadBtn = document.getElementById("uploadBtn");
    var status = document.getElementById("status");
    var uploadedImage = document.getElementById("uploadedImage");

    var selectedFile = null;

    // 啟用上傳按鈕
    fileInput.addEventListener("change", function () {
        selectedFile = fileInput.files[0];
        uploadBtn.disabled = !selectedFile;
    });

    // 上傳檔案
    uploadBtn.addEventListener("click", function () {
        if (!selectedFile) {
            status.textContent = "Please select a file.";
            return;
        }

        var fileName = "uploads/" + selectedFile.name;

        // Step 1: 獲取 Presigned URL
        fetch("http://localhost:8080/getPresignedUrl?fileName=" + encodeURIComponent(fileName))
            .then(function (response) {
                if (!response.ok) throw new Error("Failed to get Presigned URL");
                return response.json();
            })
            .then(function (data) {
                var presignedUrl = data.presignedUrl;

                // Step 2: 使用 Presigned URL 上傳檔案
                return fetch(presignedUrl, {
                    method: "PUT",
                    headers: { "Content-Type": selectedFile.type },
                    body: selectedFile,
                });
            })
            .then(function (uploadResponse) {
                if (!uploadResponse.ok) throw new Error("Failed to upload file");

                // 成功上傳
                status.textContent = "File uploaded successfully!";
                uploadedImage.src = "/uploads/" + selectedFile.name; // 假設公共訪問
            })
            .catch(function (error) {
                status.textContent = "Error: " + error.message;
            });
    });
});
