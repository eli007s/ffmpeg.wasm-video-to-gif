<template>
  <div class="antialiased text-gray-900 px-6">
    <div class="max-w-7xl mx-auto py-12">
      <div class="text-center">
          <h1 class="text-4xl font-semibold">Video to GIF converter</h1>
          <h3 class="text-lg">Vue + FFMPEG.WASM + Tailwind CSS</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div :class="`bg-white rounded md:shadow p-4 ${!videoSrc && 'h-60'} flex flex-col items-center justify-center`">
              <video v-if="videoSrc" controls :src="videoSrc" class="mb-4"></video>
              <input ref="fileInput" @change="updatePreview" type="file" class="hidden" accept="video/*" />
              <div>
                <Button :disabled="!isReady || isConverting" @click="$refs.fileInput.click()" text="Select Video File" />
                <Button class="ml-2" v-if="videoSrc" :disabled="isConverting" @click="convertToGIF" :text="isConverting ? 'Converting Video...' : 'Convert To GIF'" />
              </div>
          </div>
          <div class="bg-white rounded md:shadow p-4">
            <div class="flex items-center justify-center h-full">
              <div v-if="imageSrc" class="text-center">
                <img :src="imageSrc" alt="output gif" class="mb-4" />
                <Button @click="downloadBlob(imageSrc)" text="Download GIF" />
              </div>
              <div v-else class="text-gray-500 text-xl">Output goes here</div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import FFmpeg from '@ffmpeg/ffmpeg'

import { downloadBlob } from './utils'

import Button from './components/Button.vue'

const { createFFmpeg, fetchFile } = FFmpeg
const ffmpeg = createFFmpeg({ log: false })

export default {
  name: 'App',
  components: { Button },
  setup() {
    const videoSrc = ref(null)
    const video = ref(null)
    const isReady = ref(false)
    const imageSrc = ref(null)
    const isConverting = ref(false)

    const load = async () => {
      await ffmpeg.load()
      isReady.value = true
    }

    load()

    const updatePreview = (e) => {
      if (e.target.files.length) {
        videoSrc.value = URL.createObjectURL(e.target.files[0])
        video.value = e.target.files[0]
      }
    }

    const convertToGIF = async () => {
      isConverting.value = true
      let tempFileOutputName = `${Date.now()}.gif`
      ffmpeg.FS('writeFile', video.value.name, await fetchFile(video.value))
      await ffmpeg.run('-i', video.value.name, tempFileOutputName)

      const data = ffmpeg.FS('readFile', tempFileOutputName)

      imageSrc.value = URL.createObjectURL(new Blob([data.buffer]), { type: 'image/gif' })
      isConverting.value = false
    }

    return {
      videoSrc,
      updatePreview,
      imageSrc,
      convertToGIF,
      isConverting,
      isReady,
      downloadBlob
    }
  }
}
</script>
