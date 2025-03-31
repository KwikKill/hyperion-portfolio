<script setup lang="ts">
import { onMounted } from 'vue';
import Bar from '@/components/Bar.vue';

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!@#$%^&*()';

onMounted(() => {
  const blink = () => {
    const element = document.getElementById('blinkingText');
    if (element) {
      // for each childs, change the content to a random char
      for (let i = 0; i < element.children.length; i += 1) {
        element.children[i].textContent = chars[Math.floor(Math.random() * chars.length)];
      }
    }
  };
  setInterval(blink, 100);
});

</script>

<template>
  <div class="mx-4 mt-4 grid min-h-full grid-cols-1 lg:grid-cols-2 custom2:grid-cols-4">
    <div class="flex w-full flex-col items-center gap-4">
      <div
        class="relative text-[11px] varysmall:text-sm md:text-base custom2:text-sm custom1:text-base"
      >
        <img
          src="@/assets/cyberpunk/text-small.png"
          alt="logo"
          class=""
        />
        <div
          class="absolute left-[20%] top-[3%]"
        >
          About me
        </div>
        <div
          class="absolute left-[16%] top-[40%] flex w-4/5 flex-col gap-[11px] varysmall:gap-[17px]"
        >
          <div
            class="ml-4"
          >
            <b>KikKill</b> : {{
              Math.floor((Number(new Date()) - Number(new Date('2003-12-05'))) / 31556952000)
            }} years old, French, Developer
          </div>
          <div>
            Loves to code, play video games, talk
          </div>
          <div>
            Hates to be bored, to be alone, to be hungry
          </div>
        </div>
      </div>
      <div
        class="my-4 flex w-full flex-row justify-center gap-2"
      >
        <div
          class="relative ml-8 overflow-hidden custom2:ml-10"
        >
          <img
            src="@/assets/cyberpunk/line.png"
            alt="logo"
            class="h-full"
          />
          <div
            id="blinkingText"
            class="pointer-events-none absolute left-[40%] top-[5%] flex flex-col blur-[1px]"
          >
            <div>
              a
            </div>
            <div>
              a
            </div>
            <div>
              a
            </div>
            <div>
              a
            </div>
            <div>
              a
            </div>
            <div>
              a
            </div>
            <div>
              a
            </div>
            <div>
              a
            </div>
            <div>
              a
            </div>
            <div>
              a
            </div>
          </div>
        </div>
        <div
          class="flex flex-col"
        >
          <Bar level="intro" text="Skills"/>
          <Bar level="7" text="Coding"/>
          <Bar level="6" text="TeamWork !"/>
          <Bar level="8" text="Playing Video Games"/>
          <Bar level="6" text="Organisation"/>
          <Bar level="0" text="Drawing..."/>
          <Bar level="9" text="Sens of humour"/>
        </div>
      </div>
    </div>
    <div class="flex w-full flex-col px-4">
      <div class="text-center">
        b
      </div>
    </div>
    <div class="flex w-full flex-col">
      <div class="text-center">
        c
      </div>
    </div>
    <div class="flex w-full flex-col">
      <div class="text-center">
        d
      </div>
    </div>
  </div>
</template>
