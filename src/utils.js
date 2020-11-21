export const downloadBlob = (src) => {
    const saveImg = document.createElement('a')
    saveImg.href = src
    saveImg.download = `${Date.now()}.gif`
    saveImg.click()
}