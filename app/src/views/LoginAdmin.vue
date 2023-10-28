<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { Input, Button } from '@/components/common'
import { inputValidator } from '@/utils/validators'
import { fireAlert } from '@/utils/alerts'
import { UserServices } from '@/services/userServices';
import md5 from 'md5';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';


const router = useRouter();
const auth = useAuthStore();
const sesion_dialog: Ref<HTMLDivElement | undefined> = ref();

enum userAction {
  register = 'Register',
  login = 'Inicio de sesión'
}

const windowStatus = ref({
  mode: userAction.login
})

const loginForm = ref({
  username: '',
  password: '',
  nickname: ''
})

const login = async () => {
  const { data, status } = await new UserServices().login(
    {
      ...loginForm.value,
      password: md5(loginForm.value.password),
    })
  if (Object.keys(data).length > 0) {
    auth.login(data.user, data.token)
    // router.push({name: 'dashboard'})
  } else {
    fireAlert({
      title: "We didn't found a user with these credentials",
      type: "warning"
    })
  }
}


const forgotPassword = async () => {
  if (!new inputValidator(loginForm.value.username).check()) {
    fireAlert({
      title: "This is not a valid email",
      type: 'warning'
    })
    return
  }

  const { data, status } = await new UserServices().recovery({ ...loginForm.value })

  fireAlert({
    title: data.message,
    type: status == 210 ?
      'error' : 'success'
  })
  return


}

onMounted(() => {
  if(auth.logged){
    setTimeout(() => {
      sesion_dialog.value?.classList.remove('!opacity-0')
    }, 500);
  }
})


</script>

<template>
  <div class="w-full h-full bg-transparent flex flex-wrap select-none">
    <div
      class="w-full tablet:w-2/3 laptop:w-1/2 flex duration-200 flex-wrap items-center justify-center tablet:px-10 phone:px-5 bg-gradient-to-b from-primary via-third to-third">
      <div class="flex w-full flex-wrap bg-white bg-opacity-70 py-12 tablet:px-10 phone:px-5 rounded-xl">
        <div class="text-3xl font-bold w-full text-center py-3">
          Plataforma administrativa de Megatire
        </div>
        <div class="flex flex-wrap justify-center phone:pt-4 w-full">
          <span class="w-full text-center text-xl font-bold py-1 px-3 cursor-pointer montserrat duration-200 login" :class="[
            windowStatus.mode == userAction.login ?
              'text-primary login-active' :
              'text-gray-600 hover:bg-gray-50'
          ]" @click="() => {
  windowStatus.mode = userAction.login
}">
            {{ userAction.login }}
          </span>
        </div>
        <div class="w-full flex flex-wrap" v-if="windowStatus.mode == userAction.login">
          <div class="pt-6 w-full">
            <Input v-model="loginForm.username" label="username" placeholder="Type your username" />
          </div>
          <div class="pt-6 w-full">
            <Input v-model="loginForm.password" label="password" placeholder="Type your password" type="password" />
          </div>
          <div class="pt-6 w-full flex justify-end items-center">
            <span class="w-1/2 text-xs hover:scale-110 duration-200 cursor-pointer px-3" @click="forgotPassword" v-if="false">
              Forgot your password?
            </span>
            <Button class="tablet:w-1/2 phone:w-full font-bold" exact-color color="primary" content="¡Iniciar sesión!" @click="login" />
          </div>
        </div>
      </div>
    </div>
    <div class="h-full w-0 tablet:flex duration-200 tablet:w-1/3 laptop:w-1/2 overflow-hidden" @contextmenu.prevent
      id="login-wallpaper">
    </div>
    <div class="fixed tablet:w-60 phone:w-full h-44 flex p-3 right-0 duration-500 !opacity-0" ref="sesion_dialog">
      <div class="bg-white rounded-lg h-full w-full duration-200 flex flex-col px-2 pt-3 cursor-pointer gap-2">
        <span class="text-xl w-full text-center font-bold pb-2">
          Ya iniciaste sesión
        </span>
        <Button exact-color color="third" content="Cerrar sesión" @click="auth.logout(); sesion_dialog?.classList.add('!opacity-0')"/>
        <Button exact-color color="primary" content="Volver al panel" @click="router.push({name: 'admin-dashboard'})"/>
      </div>
    </div>
  </div>
</template>

<style>
#login-wallpaper {
  background: url('/public/balanceo.jpg') no-repeat fixed center 10% / cover;
}

.login {
  position: relative;
  height: 40px;
  padding-bottom: 10px;
}

.login::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #1d4489;
  transform-origin: right;
  transform: scaleX(0);
  transition: transform 0.2s ease-out;
}

.login-active::before {
  transform: scaleX(1);
}

.register {
  position: relative;
  height: 40px;
  padding-bottom: 10px;
}

.register::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #1d4489;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.2s ease-out;
}

.register-active::before {
  transform: scaleX(1);
}
</style>
