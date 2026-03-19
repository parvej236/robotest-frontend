<template>
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 mt-6">
        <!-- Section Header -->
        <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-display font-black text-white"
                style="text-shadow:0 0 30px rgba(255,0,51,0.6)">
                Contest Rules & Guidelines
            </h2>
            <p class="text-white/50 mt-3 font-body text-lg md:text-xl max-w-2xl mx-auto">
                Make sure to read all the rules carefully before participating in the robotics contests.
            </p>
        </div>

        <!-- Rules Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="(rule, index) in rules" :key="index"
                class="bg-dark-900/80 backdrop-blur-md rounded-xl p-6 flex flex-col items-center hover:shadow-neon-red/40 transition-all duration-300">

                <!-- Icon/Image -->
                <div class="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-500/20">
                    <img :src="rule.icon" alt="icon" class="w-10 h-10" />
                </div>

                <!-- Rule Title -->
                <h3 class="text-white font-display font-bold text-xl mb-2 text-center">
                    {{ rule.title }}
                </h3>

                <!-- Rule Description -->
                <p class="text-white/60 font-body text-sm md:text-base text-center">
                    {{ rule.description }}
                </p>

                <!-- Optional Link or Note -->
                <p v-if="rule.note" class="mt-2 text-neon-red font-mono text-xs text-center">
                    {{ rule.note }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Example detailed rules
const rules = ref([
    {
        title: 'Team Registration',
        description: 'Each team must register online before the contest begins.',
        icon: '/images/icons/registration.png',
        note: 'Deadline: 24 hours before contest'
    },
    {
        title: 'Robot Specifications',
        description: 'All robots must meet the size, weight, and battery specifications provided.',
        icon: '/images/icons/robot.png',
        note: 'Check detailed spec sheet'
    },
    {
        title: 'Safety First',
        description: 'Teams must follow all safety guidelines; non-compliance may lead to disqualification.',
        icon: '/images/icons/safety.png'
    },
    {
        title: 'Fair Play',
        description: 'No interference with other teams’ robots. Judges’ decisions are final.',
        icon: '/images/icons/fairplay.png'
    },
    {
        title: 'Timing Rules',
        description: 'All events start exactly at the scheduled time. Late teams may forfeit.',
        icon: '/images/icons/timer.png'
    },
    {
        title: 'Judging Criteria',
        description: 'Performance, creativity, and design will be evaluated according to contest rubric.',
        icon: '/images/icons/judging.png'
    }
])
</script>

<style scoped>
.bg-dark-900 {
    background-color: rgba(15, 15, 15, 0.85);
}

.text-neon-red {
    color: #ff0033;
}

.font-display {
    font-family: 'Roboto', sans-serif;
}

.hover\:shadow-neon-red\/40:hover {
    box-shadow: 0 0 20px rgba(255, 0, 51, 0.4);
}
</style>