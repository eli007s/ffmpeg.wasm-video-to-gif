import { ref } from "vue"
import FFmpeg from '@ffmpeg/ffmpeg'

const { createFFmpeg, fetchFile } = FFmpeg
const ffmpeg = createFFmpeg({ log: false })

export default function useFFmpeg() {
    const isReady = ref(false)
    const isConverting = ref(false)
    const output = ref(null)

    const load = async () => {
        await ffmpeg.load()
        isReady.value = true
    }

    load()

    const convertToGIF = async (video) => {
        isConverting.value = true
        let tempFileOutputName = `${Date.now()}.gif`
        ffmpeg.FS('writeFile', video.name, await fetchFile(video))
        await ffmpeg.run('-i', video.name, tempFileOutputName)
  
        const data = ffmpeg.FS('readFile', tempFileOutputName)
  
        output.value = URL.createObjectURL(new Blob([data.buffer]), { type: 'image/gif' })
        isConverting.value = false
    }

    return {
        isReady,
        convertToGIF,
        output,
        isConverting
    }
}