<template>
    <button :disabled="disabled" class="disabled:opacity-50 disabled:cursor-not-allowed bg-gray-900 transition text-white py-3 px-6 rounded hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none">
        {{ text }}
    </button>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: 'Button',
            required: true
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false
        }
    }
}
</script>