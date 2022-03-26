<template>
    <div class="container space-y-3" md="w-500px">
        <InputItem v-model="account.email" placeholder="Email address" required>
            <line-md:email-twotone-alt />
        </InputItem>
        <div class="flex items-center space-x-3">
            <InputItem class="w-2/3" v-model="account.code" placeholder="PIN" required>
                <bi:send-check-fill />
            </InputItem>
            <el-button
                class="w-1/3 rounded-md"
                size="large"
                type="primary"
                @click="sendCode"
                :disabled="isCDTIme"
            >SEND CODE</el-button>
        </div>
        <InputItem v-model="account.password" placeholder="Password" required>
            <ant-design:lock-twotone />
        </InputItem>
        <Button @click="submitRegister" type="primary" text="SIGN UP">
            <ant-design:lock-twotone />
        </Button>
        <p class="text-sm font-bold text-dark-50 text-center">
            Have an account?
            <router-link to="/login" class="text-current underline underline-current">Sign in now.</router-link>
        </p>
    </div>
</template>

<script setup>
import { isValidEmail } from "~/libs/validator";
import { setProfile } from '~/store';
import { register, sendCodeToEmail } from "~/api";
const sendMessage = inject("sendMessage");

const account = reactive({
    email: "",
    password: "",
    code: "",
});

// 发送邮箱验证码
let isCDTIme = ref(false);
function sendCode(e) {
    if (account.email == "") {
        sendMessage({
            type: "error",
            message: "Can't send code without email.",
        });
        return;
    } else if (!isValidEmail(account.email)) {
        sendMessage({
            type: "error",
            message: "Incorrect email address.",
        });
        return;
    }

    sendCodeToEmail({ email: account.email }).then(res => {
        const { code, data, message } = res;
        if (code == 200) {
            sendMessage({
                type: "success",
                message: "Code has been sent.",
            });
            isCDTIme.value = true;
            let cdTime = 60,
                _target = e.target;

            function createTimeout() {
                if (cdTime > 0) {
                    _target.textContent = cdTime-- + "s resend";
                    setTimeout(createTimeout, 1000);
                } else {
                    _target.textContent = "send code";
                    isCDTIme.value = false;
                }
            }
            createTimeout();
        } else {
            sendMessage({
                type: "error",
                message: message,
            });
        }
    }).catch(err => {
        sendMessage({
            type: "error",
            message: "Send failed, please check your network connection and try again.",
        });
    });
}

// submitRegister
const router = useRouter();
async function submitRegister() {
    // 邮箱预检
    if (account.email == "") {
        sendMessage({
            type: "error",
            message: "Email is required.",
        })
        Toast();
        return;
    } else if (!isValidEmail(account.email)) {
        sendMessage({
            type: "error",
            message: "Incorrect email address.",
        });
        return;
    }
    // 密码预检
    if (account.password == "") {
        sendMessage({
            type: "error",
            message: "Password is required.",
        });
        return;
    }

    try {
        const res = await register(account);
        setProfile(res);
        router.push('/');
    } catch (error) {
        if (error.code == 10001) {
            sendMessage({
                type: "error",
                message: "The email address has been registered.",
            });
        } else {
            sendMessage({
                type: "error",
                message: "Register failed, please check your network connection and try again.",
            });
        }
    }
}
</script>