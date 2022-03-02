<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    autofocus: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    }
})

const inputItemRef = ref(null);
const _type = ref(props.type);
</script>

<template>
    <div ref="inputItemRef" class="input-item">
        <slot name="default">
            <line-md:email-twotone-alt />
        </slot>
        <input
            v-model="modelValue"
            :type="_type"
            :autofocus="autofocus"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)"
            @focusin="inputItemRef.classList.remove('error')"
            @blur="required && modelValue == '' && inputItemRef.classList.add('error')"
        />
        <div v-if="type == 'password'" class="flex">
            <ant-design:eye-twotone
                v-if="_type == 'password'"
                class="!bg-transparent text-gray-500"
                @click="_type = 'text'"
            />
            <ant-design:eye-invisible-twotone
                v-else
                class="!bg-transparent text-gray-500"
                @click="_type = 'password'"
            />
        </div>
    </div>
</template>