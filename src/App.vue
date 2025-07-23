<template>
  <div id="app">
    <!-- ✅ Barre de navigation Bootstrap avec fond orange -->
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: orange;">
      <div class="container">
        <a class="navbar-brand" href="#">📡 SMS Orange</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/" exact-active-class="active">Envoyer un SMS</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/messages" exact-active-class="active">Messages</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin" exact-active-class="active">Administration</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- ✅ Zone avec transition entre les pages -->
    <div class="container py-4">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-image: url('@/assets/background2.jpeg'); /* ✅ image locale */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
}

/* ✅ Effet hover sur liens du menu */
.nav-link {
  transition: background-color 0.3s, color 0.3s;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff !important;
}

/* ✅ Transition fade entre pages */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
