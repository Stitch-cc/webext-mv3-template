<script setup>
import { extContentConfig } from '../../config';
const { service_email, simple_name, FAQs_page } = extContentConfig;
</script>

<template>
    <div class="space-y-3">
        <p class="space-x-1 flex flex-row items-center text-base text-gray-800">
            <ant-design:question-circle-twotone class="text-blue-500" />
            <span>FAQs and Troubleshootings</span>
        </p>
        <p
            class="px-2 text-sm text-gray-600 indent-md"
        >Got a question? Something doesn't work? Most likely you are not alone and your question got an answer at our evergrowing FAQs page.</p>
        <a class="btn btn-green" :href="FAQs_page" target="_blank">
            <div class="btn-icon">
                <akar-icons:link-out />
            </div>
            <span>FAQs Page</span>
        </a>
        <div class="space-y-1 flex flex-col items-center text-xs text-gray-600">
            <p>
                Do you have idea for making
                <span>{{ simple_name }}</span> better? We'd love to hear about it!
            </p>
            <p class="space-x-1 flex flex-row items-center text-blue-500">
                <icon-park-outline:send-email />
                <a :href="`mailto:${service_email}`" class="underline">{{ service_email }}</a>
            </p>
        </div>
    </div>
</template>