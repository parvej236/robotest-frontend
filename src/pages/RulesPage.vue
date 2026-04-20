<template>
    <div class="relative min-h-screen bg-transparent text-white/90 font-sans selection:bg-red-500/30 overflow-x-hidden">
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
            <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        </div>
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[140px]"></div>
            <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px]"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 py-20">

            <div v-if="authStore?.isAdmin" class="fixed bottom-8 right-8 z-50 flex gap-4">
                <button @click="isEditing = !isEditing"
                    class="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-xs tracking-widest rounded-2xl border border-white/10 backdrop-blur-2xl transition-all duration-300 shadow-2xl">
                    {{ isEditing ? 'Discard Changes' : 'Edit Rulebook' }}
                </button>
                <button v-if="isEditing" @click="saveChanges" :disabled="saving"
                    class="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 transition-all duration-300 disabled:opacity-50">
                    {{ saving ? 'Syncing...' : 'Save Changes' }}
                </button>
            </div>

            <header class="mb-12 flex flex-col items-center text-center">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-16 h-[1px] bg-red-600"></div>
                    <span class="text-xs tracking-[0.6em] text-red-500 font-black uppercase italic">Official RMEDU
                        Standard</span>
                    <div class="w-16 h-[1px] bg-red-600"></div>
                </div>
                <h1
                    class="text-xl md:text-2xl lg:text-3xl font-black uppercase italic tracking-tighter leading-[0.9] text-white">
                    CONTEST <span class="text-red-600">RULEBOOK</span>
                </h1>
            </header>

            <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div
                    class="lg:col-span-8 p-10 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.03] transition-all duration-500">
                    <h2
                        class="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 flex items-center gap-4 text-white">
                        <span class="w-2 h-8 bg-red-600"></span>Overview
                    </h2>
                    <textarea v-if="isEditing" v-model="sections.overview"
                        class="w-full h-64 bg-black/40 border border-red-900/40 rounded-2xl p-6 text-lg font-mono text-red-100 focus:ring-1 focus:ring-red-600 outline-none resize-none"></textarea>
                    <p v-else class="text-lg md:text-xl text-white/70 leading-relaxed font-light whitespace-pre-wrap">
                        {{ sections.overview }}
                    </p>
                </div>

                <div
                    class="lg:col-span-4 p-10 rounded-[40px] bg-white/[0.01] border border-white/5 backdrop-blur-3xl transition-all duration-500">
                    <h2 class="text-xs font-black uppercase mb-8 text-white/30 tracking-[0.4em]">Eligibility</h2>

                    <textarea v-if="isEditing" v-model="sections.eligibility"
                        placeholder="Enter each requirement on a new line..."
                        class="w-full h-64 bg-black/60 border border-white/10 rounded-2xl p-6 text-base font-mono text-white/50 focus:border-red-600 outline-none resize-none transition-colors"></textarea>

                    <ul v-else class="space-y-4">
                        <li v-for="(point, index) in eligibilityPoints" :key="index" class="flex items-start gap-3">
                            <span
                                class="mt-2 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 shadow-[0_0_8px_#dc2626]"></span>
                            <span class="text-base md:text-lg text-white/50 italic leading-snug font-light">
                                {{ point }}
                            </span>
                        </li>
                    </ul>
                </div>

                <div
                    class="lg:col-span-12 p-10 md:p-12 rounded-[40px] bg-gradient-to-br from-green-600/20 via-transparent to-emerald-200/20 border border-white/5 hover:border-red-600/20 transition-all duration-500">
                    <div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                        <div>
                            <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                                CAD</h2>
                            <span
                                class="text-sm font-bold text-green-500 tracking-[0.4em] uppercase opacity-80 italic">Quick
                                CAD Speed Modeling Contest</span>
                        </div>
                        <div
                            class="px-8 py-3 rounded-full border border-green-500/20 text-xs font-black text-green-500 tracking-[0.5em] uppercase bg-green-500/5">
                            Bi-Weekly
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div class="space-y-8">
                            <div class="group">
                                <textarea v-if="isEditing" v-model="sections.quick_cad_speed_modeling.description"
                                    class="w-full h-32 bg-black/60 border border-white/10 rounded-2xl p-5 text-lg font-mono text-white outline-none focus:border-red-600 transition-all"></textarea>
                                <p v-else class="text-xl md:text-2xl text-white/80 font-light leading-relaxed">
                                    {{ sections.quick_cad_speed_modeling?.description }}
                                </p>
                            </div>

                            <div
                                class="p-4 rounded-[32px] bg-white/[0.03] border border-green-500/50 flex items-center justify-between">
                                <div>
                                    <span class="block text-[10px] uppercase tracking-widest opacity-40 mb-1">Time
                                        Limit</span>
                                    <input v-if="isEditing" v-model="sections.quick_cad_speed_modeling.duration"
                                        class="bg-transparent border-b border-green-500/30 text-2xl font-black text-white outline-none focus:border-green-500 w-full" />
                                    <span v-else class="text-3xl font-black text-white tracking-tighter">{{
                                        sections.quick_cad_speed_modeling?.duration }}</span>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <span
                                    class="block text-sm uppercase tracking-widest text-green-500 font-black">Submission
                                    Requirements</span>
                                <div class="flex flex-wrap gap-3">
                                    <span
                                        v-for="tag in ['Model weight (mass)', 'Submission time is recorded automatically']"
                                        :key="tag"
                                        class="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-600/30 text-sm font-mono text-white uppercase">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div class="space-y-6">
                            <div class="text-green-500 font-bold uppercase">Evaluation Criteria</div>
                            <div v-for="(criterion, index) in [
                                { name: 'Geometry Validation', description: 'The model must match the provided drawing. Incorrect geometry leads to disqualification.' },
                                {
                                    name: 'Weight Accuracy',
                                    description: 'Ranking is based on closeness to the actual model weight. Lower error receives a higher rank.'
                                },
                                { name: 'Submission Time', description: 'If two entries are similarly accurate, the earlier submission ranks higher.' }
                            ]" :key="index" class="space-y-2">

                                <div class="flex items-center gap-3">
                                    <span
                                        class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_#10b981]"></span>
                                    <span class="text-base font-semibold text-emerald-400">{{ criterion.name }}</span>
                                </div>

                                <p class="text-sm text-white/60 leading-relaxed pl-6">
                                    {{ criterion.description }}
                                </p>

                                <div v-if="index === 1" class="pl-6 pt-2">
                                    <div
                                        class="inline-flex items-center gap-4 px-5 py-3 rounded-2xl bg-black/40 border border-emerald-500/20 backdrop-blur-md group-hover:border-emerald-500/40 transition-all duration-500">
                                        <div class="font-mono text-sm tracking-tight text-emerald-100/90 italic">
                                            Weight Error =
                                            <span class="text-emerald-400 font-bold">|</span>
                                            Submitted Weight
                                            <span class="text-emerald-500 mx-1">−</span>
                                            Actual Weight
                                            <span class="text-emerald-400 font-bold">|</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="lg:col-span-12 p-10 md:p-14 rounded-[56px] bg-gradient-to-br from-blue-600/20 via-transparent to-blue-200/20 border border-white/5 hover:border-blue-600/20 transition-all duration-700">
                    <div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                        <div>
                            <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                                Mechathon</h2>
                            <span
                                class="text-sm font-bold text-blue-500 tracking-[0.4em] uppercase opacity-80 italic">Creative
                                Mechanism Design</span>
                        </div>
                        <div
                            class="px-8 py-3 rounded-full border border-blue-500/20 text-xs font-black text-blue-500 tracking-[0.5em] uppercase bg-blue-500/5">
                            Monthly Team Challenge
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div class="space-y-10">
                            <div>
                                <p class="text-xl md:text-2xl text-white/70 font-light leading-tight">
                                    A team-based sprint where exactly <span
                                        class="text-white font-normal underline decoration-blue-500/30">2 members</span>
                                    solve complex engineering challenges through functional mechanism design.
                                </p>
                            </div>

                            <div
                                class="p-6 rounded-[40px] bg-white/[0.03] border border-white/5 flex items-center justify-between group/time">
                                <div class="flex-1">
                                    <span class="block text-[10px] uppercase tracking-widest opacity-40 mb-2">Time
                                        Limit</span>
                                    <input v-if="isEditing" v-model="sections.mechathon.duration"
                                        class="bg-transparent border-b-2 border-blue-600/30 text-3xl font-black text-white outline-none focus:border-blue-600 w-full py-1 transition-all" />
                                    <span v-else class="text-4xl font-black text-white tracking-tighter">{{
                                        sections.mechathon?.duration }}</span>
                                </div>
                            </div>

                            <div class="p-8 rounded-[32px] bg-blue-600/[0.03] border border-blue-600/10">
                                <h3
                                    class="text-xs font-black uppercase tracking-widest text-blue-500/60 mb-6 flex items-center gap-2">
                                    Team Rules
                                </h3>
                                <ul class="space-y-4">
                                    <li class="flex items-center gap-4">
                                        <span class="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                        <span class="text-base text-white/70 font-light leading-relaxed">Each team must
                                            consist of exactly <span class="text-white font-semibold">2
                                                members</span>.</span>
                                    </li>
                                    <li class="flex items-center gap-4">
                                        <span class="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                        <span class="text-base text-white/70 font-light leading-relaxed">A participant
                                            may join only <span class="text-white font-semibold">one team</span>.</span>
                                    </li>
                                    <li class="flex items-center gap-4">
                                        <span class="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                        <span class="text-base text-white/70 font-light leading-relaxed">Each team must
                                            nominate <span class="text-white font-semibold">one team leader</span> for
                                            final submission.</span>
                                    </li>
                                </ul>
                            </div>



                            <div class="space-y-4">
                                <span class="block text-sm uppercase tracking-widest text-blue-500 font-black">Fixed
                                    Submission Formats</span>
                                <div class="flex flex-wrap gap-3">
                                    <span
                                        v-for="tag in ['CAD: STEP(.step/.stp)', 'Report: PDF', 'Images: PNG/JPG', 'Animation: MP4/GIF']"
                                        :key="tag"
                                        class="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-600/30 text-sm font-mono text-white uppercase">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-8">
                            <div class="p-8 rounded-[32px] bg-blue-600/[0.03] border border-blue-600/10">
                                <h3
                                    class="text-xs font-black uppercase tracking-widest text-blue-500/60 mb-6 flex items-center gap-2">
                                    Judging Criteria
                                </h3>
                                <div class="space-y-4 mb-6">
                                    <div v-for="(criterion, index) in [
                                        { name: 'Accuracy of the model', percentage: 'creativity_innovation' },
                                        { name: 'Design methodology', percentage: 'functionality' },
                                        { name: 'Efficiency of modeling', percentage: 'cad_modeling' },
                                        { name: 'Creativity and problem-solving', percentage: 'engineering_feasibility' },
                                        { name: 'Completion in time', percentage: 'engineering_feasibility' }
                                    ]" :key="index" class="flex items-center justify-between">
                                        <span class="text-base text-white/70 font-light">{{ criterion.name }}</span>
                                        <div class="flex items-center gap-2">
                                            <input v-if="isEditing" v-model="sections.mechathon[criterion.percentage]"
                                                type="number" min="0" max="100"
                                                class="w-16 bg-black/40 border border-blue-500/30 rounded-lg px-3 py-1 text-white font-bold text-center outline-none focus:border-blue-500" />
                                            <span v-else class="text-white font-bold text-lg hidden">{{
                                                sections.mechathon[criterion.percentage] }}%</span>
                                        </div>
                                    </div>
                                </div>
                                <p class="text-sm text-white/50 italic leading-relaxed">
                                    Judges may also consider design clarity, efficiency, motion quality, realism, and
                                    assembly quality.
                                </p>
                            </div>



                            <div class="p-8 rounded-[32px] bg-purple-600/[0.03] border border-purple-600/10">
                                <h3
                                    class="text-xs font-black uppercase tracking-widest text-purple-400 mb-6 flex items-center gap-2">
                                    Submission Requirements
                                </h3>
                                <ul class="space-y-4">
                                    <li class="space-y-3">
                                        <div class="flex items-center gap-4">
                                            <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                                            <span class="text-base text-white font-semibold italic">Short PDF report
                                                including:</span>
                                        </div>
                                        <ul class="ml-8 space-y-2">
                                            <li class="flex items-center gap-3 text-white/60 font-light">
                                                <span class="text-purple-500">—</span> working principle
                                            </li>
                                            <li class="flex items-center gap-3 text-white/60 font-light">
                                                <span class="text-purple-500">—</span> visualization (figure diagram)
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="flex items-center gap-4">
                                        <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                                        <span class="text-base text-white/80 font-light leading-relaxed">Real world
                                            feasibility</span>
                                    </li>

                                    <li class="flex items-center gap-4">
                                        <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                                        <span class="text-base text-white/80 font-light leading-relaxed">Optional Mathematical
                                            Model</span>
                                    </li>
                                    <li class="flex items-center gap-4">
                                        <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                                        <span class="text-base text-white/80 font-light leading-relaxed">Optional CAD file</span>
                                    </li>
                                    <li class="flex items-center gap-4">
                                        <span class="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                                        <span class="text-base text-white/80 font-light leading-relaxed">Optional
                                            video</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-12 px-8 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.03] transition-all duration-500">
                    <div class="text-xl text-center mb-2 py-4">Score System</div>
                    <img src="@/assets/marking.png" alt="Marking Scheme" class="w-full rounded-2xl border border-white/10 shadow-lg">
                </div>


                <div
                    class="lg:col-span-12 p-10 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.03] transition-all duration-500">
                    <h2
                        class="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 flex items-center gap-4 text-white">
                        <span class="w-2 h-8 bg-green-600"></span>Allowed Software
                    </h2>
                    <p class="text-lg md:text-xl text-white/70 leading-relaxed font-light mb-8">
                        Participants may use any professional CAD software, including:
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="software in ['FreeCAD', 'SolidWorks', 'Fusion 360', 'Autodesk Inventor', 'CATIA', 'Siemens NX', 'Onshape']"
                            :key="software"
                            class="p-5 rounded-2xl bg-gradient-to-br from-green-600/20 to-red-600/5 border border-green-600/30 hover:border-green-600/60 hover:bg-green-600/15 transition-all duration-300 flex items-center gap-3 group cursor-default">
                            <span
                                class="w-2.5 h-2.5 rounded-full bg-green-600 shrink-0 group-hover:shadow-[0_0_12px_#dc2626] transition-all"></span>
                            <span
                                class="text-base md:text-lg text-white/80 font-semibold group-hover:text-white transition-colors">
                                {{ software }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="lg:col-span-12 p-10 md:p-14 rounded-[56px] bg-gradient-to-br from-purple-600/20 via-transparent to-purple-200/20 border border-white/5 hover:border-purple-600/20 transition-all duration-700">
                <div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                    <div>
                        <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                            Leaderboard & Rewards
                        </h2>
                        <span
                            class="text-sm font-bold text-purple-500 tracking-[0.4em] uppercase opacity-80 italic">Monthly
                            Rankings & Recognition</span>
                    </div>
                    <div
                        class="px-8 py-3 rounded-full border border-purple-500/20 text-xs font-black text-purple-500 tracking-[0.5em] uppercase bg-purple-500/5">
                        Monthly Updates
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div class="space-y-8">
                        <div>
                            <h3 class="text-lg font-bold text-purple-400 mb-4 uppercase tracking-wide">Final Monthly
                                Score Weightage</h3>
                            <div class="space-y-4">
                                <div
                                    class="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-purple-500/20">
                                    <span class="text-base text-white/70 font-light">Mechathon</span>
                                    <span class="text-white font-bold text-lg">50%</span>
                                </div>
                                <div
                                    class="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-purple-500/20">
                                    <span class="text-base text-white/70 font-light">Quick CAD Speed Modeling</span>
                                    <span class="text-white font-bold text-lg">50%</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-6 rounded-[32px] bg-purple-600/[0.03] border border-purple-600/10">
                            <h3 class="text-xs font-black uppercase tracking-widest text-purple-500/60 mb-6">Monthly
                                Announcements</h3>
                            <ul class="space-y-4">
                                <li class="flex items-start gap-3">
                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                                    <span class="text-base text-white/70 font-light">Monthly Champion Team</span>
                                </li>
                                <li class="flex items-start gap-3">
                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                                    <span class="text-base text-white/70 font-light">Top Quick CAD Modeler</span>
                                </li>
                                <li class="flex items-start gap-3">
                                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                                    <span class="text-base text-white/70 font-light">Top Ranked Participants</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="space-y-8">
                        <div class="p-8 rounded-[32px] bg-purple-600/[0.03] border border-purple-600/10">
                            <h3 class="text-xs font-black uppercase tracking-widest text-purple-500/60 mb-6">Rewards &
                                Recognition</h3>
                            <p class="text-base text-white/70 font-light leading-relaxed">
                                Winners at the end of each month receive recognition and may be awarded:
                            </p>
                            <ul class="space-y-3 mt-6">
                                <li class="flex items-center gap-3">
                                    <span
                                        class="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 shadow-[0_0_8px_#a855f7]"></span>
                                    <span class="text-base text-white/60 font-light">Certificates of Achievement</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span
                                        class="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 shadow-[0_0_8px_#a855f7]"></span>
                                    <span class="text-base text-white/60 font-light">Public Recognition</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <span
                                        class="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 shadow-[0_0_8px_#a855f7]"></span>
                                    <span class="text-base text-white/60 font-light">Exclusive Prizes & Rewards</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="lg:col-span-12 p-10 md:p-14 rounded-[56px] bg-gradient-to-br from-red-600/20 via-transparent to-orange-200/20 border border-white/5 hover:border-red-600/20 transition-all duration-700">
                <div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                    <div>
                        <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                            Disqualification & Fair Play
                        </h2>
                        <span
                            class="text-sm font-bold text-red-500 tracking-[0.4em] uppercase opacity-80 italic">Integrity
                            & Contest Standards</span>
                    </div>
                    <div
                        class="px-8 py-3 rounded-full border border-red-500/20 text-xs font-black text-red-500 tracking-[0.5em] uppercase bg-red-500/5">
                        Critical Rules
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div class="p-8 rounded-[32px] bg-red-600/[0.03] border border-red-600/10">
                        <h3 class="text-xs font-black uppercase tracking-widest text-red-500/60 mb-6">Disqualification
                            Triggers</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start gap-4">
                                <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                <span class="text-base text-white/70 font-light">Copied or plagiarized designs</span>
                            </li>
                            <li class="flex items-start gap-4">
                                <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                <span class="text-base text-white/70 font-light">Downloaded internet models</span>
                            </li>
                            <li class="flex items-start gap-4">
                                <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                <span class="text-base text-white/70 font-light">Pre-made submissions created before the
                                    contest</span>
                            </li>
                            <li class="flex items-start gap-4">
                                <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                <span class="text-base text-white/70 font-light">Use of multiple accounts</span>
                            </li>
                            <li class="flex items-start gap-4">
                                <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                <span class="text-base text-white/70 font-light">False or misleading information</span>
                            </li>
                        </ul>
                    </div>

                    <div class="space-y-8">
                        <div class="p-8 rounded-[32px] bg-red-600/[0.03] border border-red-600/10">
                            <h3 class="text-xs font-black uppercase tracking-widest text-red-500/60 mb-6">Fair Play
                                Policy</h3>
                            <p class="text-base text-white/70 font-light leading-relaxed">
                                All participants must submit <span class="text-white font-semibold">original
                                    work</span>. Sharing CAD files, copying designs, or engaging in unfair collaboration
                                is <span class="text-red-400 font-semibold">strictly prohibited</span>.
                            </p>
                        </div>

                        <div class="p-8 rounded-[32px] bg-red-600/[0.03] border border-red-600/10">
                            <h3 class="text-xs font-black uppercase tracking-widest text-red-500/60 mb-6">Organizer
                                Rights</h3>
                            <ul class="space-y-3">
                                <li class="flex items-start gap-3">
                                    <span
                                        class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 shadow-[0_0_8px_#f87171]"></span>
                                    <span class="text-base text-white/60 font-light">Update the rules</span>
                                </li>
                                <li class="flex items-start gap-3">
                                    <span
                                        class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 shadow-[0_0_8px_#f87171]"></span>
                                    <span class="text-base text-white/60 font-light">Modify the contest schedule</span>
                                </li>
                                <li class="flex items-start gap-3">
                                    <span
                                        class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 shadow-[0_0_8px_#f87171]"></span>
                                    <span class="text-base text-white/60 font-light">Disqualify unfair
                                        submissions</span>
                                </li>
                            </ul>
                            <p class="text-sm text-red-400/80 font-semibold mt-6 italic">All organizer decisions are
                                final.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/utils/api'
import { useAuthStore } from '@/stores/auth'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Contest Rules - RMEDU Robotics Society',
  meta: [
    {
      name: 'description',
      content: 'Read the official rules and guidelines for RMEDU Robotics CAD contests. Understand eligibility, submission format, judging criteria, and participation policies.'
    },
    {
      property: 'og:title',
      content: 'Contest Rules - RMEDU Robotics Society'
    },
    {
      property: 'og:description',
      content: 'Official rules and guidelines for CAD contests at RMEDU Robotics Society.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

const authStore = useAuthStore()
const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)
// Updated to match the new database schema

const sections = ref({
    overview: '',
    eligibility: '',
    software_protocol: '',
    quick_cad_speed_modeling: {
        description: '',
        duration: '',
        submission_requirements: '',
        evaluation_criteria: ''
    },
    mechathon: {
        duration: "3–4 Hours",
        creativity_innovation: 30,
        functionality: 30,
        cad_modeling: 20,
        engineering_feasibility: 20,
        description: "A monthly team-based competition where participants design a mechanism to solve a given engineering challenge.",
        submission_requirements: "Complete CAD assembly, rendered images, and a short PDF report."
    },
    fair_play_and_disqualification: {
        policy: '',
        disqualification_triggers: ''
    }
})

const fetchData = async () => {
    try {
        const res = await api.get('/rulebook')
        // Handle both raw data and the data property if wrapped by axios

        const data = res.data || res
        if (data && data.sections) {
            sections.value = data.sections
        }

    } catch (err) {
        console.error("Rulebook Protocol Error:", err)
    } finally {
        loading.value = false
    }
}


const saveChanges = async () => {
    saving.value = true
    try {
        await api.put('/rulebook', { sections: sections.value })
        isEditing.value = false
    } catch (err) {
        console.error("Sync Failure:", err)
        alert("Sync Failure: Changes could not be deployed.")
    } finally {
        saving.value = false
    }
}

const eligibilityPoints = computed(() => {
    if (!sections.value.eligibility) return []
    // Splits the text by new lines and removes empty lines
    return sections.value.eligibility.split('\n').filter(line => line.trim() !== '')
})

onMounted(fetchData)

</script>

<style scoped>
/* Added for smooth text transitions */
p,
h1,
h2,
h3,
span {
    transition: color 0.3s ease;
}
</style>