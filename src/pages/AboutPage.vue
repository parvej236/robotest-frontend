<template>
  <div class="relative min-h-screen bg-[#020205] text-white/90 font-sans selection:bg-red-500/30 overflow-x-hidden">
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[150px]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020205_80%)]"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 py-20">
      
      <header class="mb-5 flex flex-col items-center text-center">
        <div class="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl">
          <div class="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
          <span class="text-xs tracking-[0.4em] text-blue-400 font-black uppercase">Dhaka University Robotics Initiative</span>
        </div>
        <h1 class="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.85] mb-6">
          ROBO <span class="text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-800">CHAMPIONS</span>
        </h1>
        <p class="max-w-2xl text-base md:text-lg text-blue-100/40 font-light leading-relaxed">
          The elite robotics contest ecosystem for the University of Dhaka. We bridge the gap between 
          computational theory and mechanical reality through high-stakes competition.
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-8 p-1px rounded-[48px] bg-gradient-to-br from-blue-500/20 via-transparent to-red-500/20">
            <div class="h-full w-full bg-[#050508]/90 backdrop-blur-3xl rounded-[47px] p-10 md:p-14 relative overflow-hidden">
                <h2 class="text-3xl font-black uppercase tracking-tight mb-10 flex items-center gap-3">
                    <span class="w-1 h-8 bg-blue-600"></span> Platform <span class="text-red-600">Overview</span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div v-for="feature in features" :key="feature.title" class="group">
                        <div class="text-blue-500 font-black text-xl uppercase tracking-widest mb-2 group-hover:text-red-500 transition-colors">// {{ feature.title }}</div>
                        <p class="text-white/50 font-light leading-relaxed text-xl">{{ feature.desc }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="p-10 rounded-[40px] bg-red-600/5 border border-red-600/10 hover:bg-red-600/10 transition-all">
            <h3 class="text-xl font-black uppercase tracking-[0.3em] text-red-500 mb-4">Mission</h3>
            <p class="text-white/60 text-xl italic leading-relaxed">Empowering Dhaka University engineers to dominate the global automation landscape.</p>
          </div>
          <div class="p-10 rounded-[40px] bg-blue-600/5 border border-blue-600/10 hover:bg-blue-600/10 transition-all">
            <h3 class="text-xl font-black uppercase tracking-[0.3em] text-blue-400 mb-4">Vision</h3>
            <p class="text-white/60 text-xl italic leading-relaxed">Creating a sustainable R&D pipeline that transforms Bangladesh into a robotics hub.</p>
          </div>
        </div>

        <div class="lg:col-span-12 mt-24">
          <h2 class="text-4xl font-black uppercase italic tracking-tighter mb-12 flex items-center gap-4">
             Architects of <span class="text-blue-600">Innovation</span>
             <div class="h-[1px] flex-grow bg-gradient-to-r from-blue-600/50 to-transparent"></div>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div v-for="member in team" :key="member.name" class="group p-4 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-blue-600/40 transition-all">
              <div class="relative aspect-square rounded-2xl overflow-hidden mb-6 border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500">
                <img :src="`https://i.pravatar.cc/400?u=${member.name}`" :alt="member.name" class="object-cover w-full h-full scale-110 group-hover:scale-100 transition-transform duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent"></div>
              </div>
              <h3 class="text-lg font-black uppercase tracking-tight">{{ member.name }}</h3>
              <p class="text-blue-600 text-xl font-bold uppercase tracking-widest mt-1">{{ member.role }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
          
          <div class="lg:col-span-1 flex flex-col gap-4">
            <div class="text-xl font-black uppercase tracking-[0.4em] text-blue-500 mb-2 ml-4">Network Hub</div>
            <div class="grid grid-cols-2 gap-4 h-full">
                <a v-for="social in socials" :key="social.label" :href="social.link" 
                class="flex flex-col items-center justify-center p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-blue-600/10 hover:border-blue-500/40 transition-all group overflow-hidden relative">
                    <div class="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-20 transition-opacity">
                        <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24" v-html="social.svg"></svg>
                    </div>
                    <svg class="w-6 h-6 mb-3 text-white/40 group-hover:text-blue-500 transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24" v-html="social.svg"></svg>
                    <span class="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white relative z-10">{{ social.label }}</span>
                </a>
            </div>
          </div>

          <div class="lg:col-span-2 p-10 md:p-14 rounded-[56px] bg-[#050508] border border-blue-500/10 shadow-2xl relative">
            <div class="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px]"></div>
            <h2 class="text-3xl font-black uppercase tracking-tighter mb-8 italic">Contact <span class="text-blue-600">With Us</span></h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" placeholder="OPERATOR NAME" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-600 transition-all text-xs font-bold tracking-widest" />
                <input type="email" placeholder="UPLINK EMAIL" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-600 transition-all text-xs font-bold tracking-widest" />
              </div>
              <textarea rows="4" placeholder="MESSAGE DATA..." class="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 outline-none focus:border-blue-600 transition-all text-xs font-bold tracking-widest resize-none"></textarea>
              <button class="relative w-full py-6 rounded-2xl bg-gradient-to-r from-blue-700 to-red-600 text-white font-black uppercase text-xl tracking-[0.5em] hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all active:scale-[0.98]">
                Transmit Signal
              </button>
            </form>
          </div>
        </div>

        <footer class="lg:col-span-12 py-10 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-6">
            <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">© 2026 RMEDU DHAKA</span>
            <div class="w-1 h-1 rounded-full bg-white/10"></div>
            <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">ROBOTICS & MECHATRONICS DEPT</span>
          </div>
        </footer>

      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  { title: 'Neural Scoring', desc: 'Custom algorithms for real-time performance tracking and arena analytics.' },
  { title: 'DU Legacy', desc: 'Directly supported by the Department of Robotics and Mechatronics Engineering.' },
  { title: 'Secure Uplink', desc: 'Encrypted submission tunnels for code and design proprietary protection.' },
  { title: 'Industry Link', desc: 'Winners get direct exposure to the leading engineering firms in Bangladesh.' }
]

const team = [
  { name: 'Dr. Sejuti Das', role: 'Faculty Mentor' },
  { name: 'M Parvej Alam', role: 'System Architect' },
  { name: 'Z. Chowdhury', role: 'Hardware Specialist' },
  { name: 'R. Islam', role: 'Event Coordinator' }
]

const socials = [
  { 
    label: 'WhatsApp', 
    link: 'https://wa.me/8801XXXXXXXXX', 
    svg: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .01 5.437.008 12.045c0 2.112.553 4.174 1.605 6.006L0 24l6.149-1.613a11.83 11.83 0 005.9 1.564h.005c6.605 0 12.04-5.437 12.042-12.045a11.813 11.813 0 00-3.585-8.423"/>' 
  },
  { 
    label: 'Facebook', 
    link: '#', 
    svg: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' 
  },
  { 
    label: 'Email', 
    link: 'mailto:contact@rmedu.org', 
    svg: '<path d="M0 3v18h24V3H0zm6.623 7.929l-4.623 5.712V5.458l4.623 5.471zm1.377 1.625l4.001 4.737 4.001-4.737 4.417 5.446H3.583l4.417-5.446zm7.377-1.625l4.623-5.471v11.183l-4.623-5.712zm.232-1.929l-4.009 4.737-4.009-4.737 7.042-6.056h-14.066l7.042 6.056z"/>' 
  },
  { 
    label: 'Account', 
    link: '/profile', 
    svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>' 
  }
]

const handleSubmit = () => {
  alert("TRANSMISSION SUCCESSFUL. DATA SYNCED.")
}
</script>

<style scoped>
h1, h2, h3 {
  font-style: italic;
}
input::placeholder, textarea::placeholder {
    color: rgba(59, 130, 246, 0.2);
}
</style>