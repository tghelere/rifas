<template>
    <div v-if="toast" class="toast-custom position-fixed bottom-0 end-0 m-3 fade-in">
        <div class="alert alert-info py-2 px-3 shadow-sm mb-0">{{ toast }}</div>
    </div>
</template>

<script setup>
defineProps({
    toast: String
})
</script>

<style scoped lang="scss">
.toast-custom {
    transition: opacity 0.5s ease;
    z-index: 1055;
}

.fade-in {
    animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
