import{_ as V,V as _}from"./UserCreation.vue_vue_type_script_setup_true_lang-c1474c2b.js";import{I as p}from"./Button.vue_vue_type_script_setup_true_lang-a65fa9bc.js";import{d as h,b as a,i as d,c as m,e as f,f as n,h as w}from"./index-9c9b437d.js";const b={class:"flex flex-wrap items-center w-full"},x={class:"pt-6 w-full"},C={key:0,class:"w-full"},U={class:"pt-6 w-full"},B=h({__name:"VehicleCreation",props:{currentRegister:{}},emits:["update:currentRegister"],setup(v,{emit:s}){const t=v,u=a(!1),i=a(!1),r=a(),c=a(void 0),g=async()=>{var e;r.value&&r.value.abort(),r.value=new AbortController;const o=await new _().listVehicles({plate:t.currentRegister.plate},(e=r.value)==null?void 0:e.signal);r.value=void 0,i.value=!0,o.data.length==1?(u.value=!0,s("update:currentRegister",{...t.currentRegister,...o.data[0]})):(u.value=!1,s("update:currentRegister",{plate:t.currentRegister.plate}))},R=async()=>{clearTimeout(c.value),c.value=setTimeout(()=>{g()},1e3)};return(o,e)=>(d(),m("div",b,[f("div",x,[n(p,{modelValue:t.currentRegister.plate,"onUpdate:modelValue":e[0]||(e[0]=l=>t.currentRegister.plate=l),placeholder:"Digite la placa del vehículo",label:"Placa",onKeyup:R},null,8,["modelValue"])]),i.value?(d(),m("div",C,[f("div",U,[n(p,{modelValue:t.currentRegister.tipo,"onUpdate:modelValue":e[1]||(e[1]=l=>t.currentRegister.tipo=l),placeholder:"Digite Moto o Carro",label:"Tipo de vehículo"},null,8,["modelValue"])]),n(V,{"current-user":t.currentRegister,"onUpdate:currentUser":e[2]||(e[2]=l=>s("update:currentRegister",l))},null,8,["current-user"])])):w("",!0)]))}});export{B as _};
