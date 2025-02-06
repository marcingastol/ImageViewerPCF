
import { imageRawData } from '../types/imageViewer'

/**
 * Patch the record containing the file field with the file to push
 * @param webApiURL webApi URL of the record to update
 * @param setCurrentUIState for updating the UI state
 * @param setImageRawData for updating the imageRawData state
 */

export const getFileContent = (webApiURL: string,
    setCurrentUIState: React.Dispatch<React.SetStateAction<string>>,
    setImageRawData: React.Dispatch<React.SetStateAction<imageRawData[]>>
) => {
    console.log(`[ImageViewerPCF] Get raw file data from CRM field`);
    const req = new XMLHttpRequest();
    req.open("GET", webApiURL);
    req.setRequestHeader("Content-Type", "application/octet-stream")
    req.setRequestHeader("Content-Range", "0-4095/8192")
    req.setRequestHeader("Accept-Encoding", "gzip, deflate")
    req.setRequestHeader("OData-MaxVersion", "4.0")
    req.setRequestHeader("OData-Version", "4.0")
    req.onreadystatechange = function () {
        console.log("[ImageViewerPCF] this.readyState");
        console.log(this.readyState);
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            console.log("[ImageViewerPCF] this.status");
            console.log(this.status);
            if (this.status === 200 || this.status === 204) {
                const base64ToString = atob(JSON.parse(req.responseText).value).toString()

                console.log("[ImageViewerPCF] base64ToString");
                console.log(base64ToString);

                const base64ToStringForm = base64ToString.slice(base64ToString.indexOf('['));

                console.log("[ImageViewerPCF] base64ToStringForm");
                console.log(base64ToStringForm);

                const imgDataList = JSON.parse(base64ToStringForm)

                console.log("[ImageViewerPCF] imgDataList");
                console.log(imgDataList);

                setImageRawData(imgDataList)

                console.log("[ImageViewerPCF] imgDataList.length");
                console.log(imgDataList.length);
                
                if (imgDataList.length == 0) {
                    setCurrentUIState("dropImage")
                }
                else {
                    setCurrentUIState("viewer")
                }
            } else {
                const error = JSON.parse(this.response).error
                console.log(`[ImageViewerPCF] Error on getFileContent : ${error.message}`)
                setCurrentUIState("viewer")
            }
        }
    };
    req.send()
}


/**
 * Patch the record containing the file field with the file to push
 * @param webApiURL webApi URL of the record to update
 * @param imageRawData base64 array content of the file
 * @param setCurrentUIState for updating the UI state
 */

export const patchFileContent = (
    webApiURL: string,
    imageRawData: imageRawData[],
    setCurrentUIState: React.Dispatch<React.SetStateAction<string>>
) => {

    console.log(`[ImageViewerPCF] Updating file data to CRM field`);

    const req = new XMLHttpRequest()
    req.open("PATCH", webApiURL)
    req.setRequestHeader("Content-Type", "application/octet-stream")
    req.setRequestHeader("Content-Range", "0-4095/8192")
    req.setRequestHeader("Accept-Encoding", "gzip, deflate")
    req.setRequestHeader("OData-MaxVersion", "4.0")
    req.setRequestHeader("OData-Version", "4.0")
    req.onreadystatechange = function () {
        console.log(this.readyState);
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            console.log(this.status);
            if (this.status === 200 || this.status === 204) {
                console.log(imageRawData);
                console.log(imageRawData.length);
                if (imageRawData.length == 0) {
                    setCurrentUIState("dropImage")
                }
                else {
                    setCurrentUIState("viewer")
                }
            } else {
                const error = JSON.parse(this.response).error
                console.log(`[ImageViewerPCF] Error on patchFileContent : ${error.message}`)
                setCurrentUIState("viewer")
            }
        }
    };
    console.log(imageRawData);
    console.log(JSON.stringify(imageRawData));
    req.send(JSON.stringify(imageRawData));
}

