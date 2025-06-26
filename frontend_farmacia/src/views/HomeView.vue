<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const activeSection = ref('about')

function handleComprarAhora() {
  if (authStore.token) {
    window.location.href = '/productos'
  } else {
    window.location.href = '/login'
  }
}

onMounted(() => {
  const scripts = [
    'https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js',
    '/lib/wow/wow.min.js',
    '/lib/easing/easing.min.js',
    '/lib/waypoints/waypoints.min.js',
    '/lib/counterup/counterup.min.js',
    '/lib/owlcarousel/owl.carousel.js',
    '/lib/owlcarousel/owl.carousel.min.js',
    '/js/main.js',
  ]

  scripts.reduce((prev, src) => {
    return prev.then(
      () =>
        new Promise((resolve) => {
          const s = document.createElement('script')
          s.src = src
          s.async = false
          s.onload = () => resolve()
          document.body.appendChild(s)
        }),
    )
  }, Promise.resolve())
})

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}

function onScroll() {
  const sections = ['about', 'services', 'blog', 'contact']
  let found = false
  for (const id of sections) {
    const el = document.getElementById(id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 80 && rect.bottom > 80) {
        activeSection.value = id
        found = true
        break
      }
    }
  }
  if (!found) activeSection.value = ''
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <main>
    <!-- Spinner Start -->
    <div
      id="spinner"
      class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
    </div>
    <!-- Spinner End -->

    <!-- Navbar & Hero Start -->
    <div class="container-fluid position-relative p-0">
      <nav class="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
        <a href="" class="navbar-brand p-0">
          <h1 class="text-primary"><i class="bi bi-capsule-pill me-3"></i>Farmacia Salud Total</h1>
          <!-- <img src="img/logo.png" alt="Logo"> -->
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span class="bi bi-list"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav ms-auto py-0">
            <a
              href="#about"
              class="nav-item nav-link"
              :class="{ active: activeSection === 'about' }"
              @click.prevent="scrollToSection('about')"
              >Nosotros</a
            >
            <a
              href="#services"
              class="nav-item nav-link"
              :class="{ active: activeSection === 'services' }"
              @click.prevent="scrollToSection('services')"
              >Servicios</a
            >
            <a
              href="#blog"
              class="nav-item nav-link"
              :class="{ active: activeSection === 'blog' }"
              @click.prevent="scrollToSection('blog')"
              >Blog</a
            >
            <a
              href="#contact"
              class="nav-item nav-link"
              :class="{ active: activeSection === 'contact' }"
              @click.prevent="scrollToSection('contact')"
              >Contacto</a
            >
          </div>
          <div class="d-none d-xl-flex me-3">
            <div class="d-flex flex-column pe-3 border-end border-primary">
              <span class="text-body">Atención 24/7</span>
              <a href="tel:+591123456789"
                ><span class="text-primary">Llámanos: +591 123 456 789</span></a
              >
            </div>
          </div>
          <a
            href="#"
            class="btn btn-primary rounded-pill d-inline-flex flex-shrink-0 py-2 px-4"
            @click.prevent="handleComprarAhora"
          >
            <template v-if="authStore.token"> ¡Hola, {{ authStore.user }}! </template>
            <template v-else> ¿Eres un empleado de Farmacia? Logueate! </template>
          </a>
        </div>
      </nav>

      <!-- Carousel Start -->
      <div class="carousel-header">
        <div id="carouselId" class="carousel slide" data-bs-ride="carousel">
          <ol class="carousel-indicators">
            <li data-bs-target="#carouselId" data-bs-slide-to="0" class="active"></li>
            <li data-bs-target="#carouselId" data-bs-slide-to="1"></li>
            <li data-bs-target="#carouselId" data-bs-slide-to="2"></li>
          </ol>
          <div class="carousel-inner" role="listbox">
            <div class="carousel-item active">
              <img src="/img/home1.jpg" class="img-fluid w-100" alt="Imagen" />
              <div class="carousel-caption-1">
                <div class="carousel-caption-1-content" style="max-width: 900px">
                  <h4
                    class="text-white text-uppercase fw-bold mb-4 fadeInLeft animated"
                    data-animation="fadeInLeft"
                    data-delay="1s"
                    style="animation-delay: 1s; letter-spacing: 3px"
                  >
                    ¡Bienvenido a tu farmacia de confianza!
                  </h4>
                  <h1
                    class="display-2 text-capitalize text-white mb-4 fadeInLeft animated"
                    data-animation="fadeInLeft"
                    data-delay="1.3s"
                    style="animation-delay: 1.3s"
                  >
                    Cuidamos tu salud y la de tu familia
                  </h1>
                  <p
                    class="mb-5 fs-5 text-white fadeInLeft animated"
                    data-animation="fadeInLeft"
                    data-delay="1.5s"
                    style="animation-delay: 1.5s"
                  >
                    Medicamentos, insumos y atención profesional para tu bienestar. ¡Compra fácil y
                    seguro!
                  </p>
                  <div
                    class="carousel-caption-1-content-btn fadeInLeft animated"
                    data-animation="fadeInLeft"
                    data-delay="1.7s"
                    style="animation-delay: 1.7s"
                  ></div>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <img src="/img/home1-1.jpg" class="img-fluid w-100" alt="Imagen" />
              <div class="carousel-caption-2">
                <div class="carousel-caption-2-content" style="max-width: 900px">
                  <h4
                    class="text-white text-uppercase fw-bold mb-4 fadeInRight animated"
                    data-animation="fadeInRight"
                    data-delay="1s"
                    style="animation-delay: 1s; letter-spacing: 3px"
                  >
                    Atención personalizada
                  </h4>
                  <h1
                    class="display-2 text-capitalize text-white mb-4 fadeInRight animated"
                    data-animation="fadeInRight"
                    data-delay="1.3s"
                    style="animation-delay: 1.3s"
                  >
                    Medicamentos y productos de calidad
                  </h1>
                  <p
                    class="mb-5 fs-5 text-white fadeInRight animated"
                    data-animation="fadeInRight"
                    data-delay="1.5s"
                    style="animation-delay: 1.5s"
                  >
                    Entrega rápida, asesoría farmacéutica y todo lo que necesitas para tu salud.
                  </p>
                  <div
                    class="carousel-caption-2-content-btn fadeInRight animated"
                    data-animation="fadeInRight"
                    data-delay="1.7s"
                    style="animation-delay: 1.7s"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselId"
            data-bs-slide="prev"
          >
            <span
              class="carousel-control-prev-icon btn btn-primary fadeInLeft animated"
              aria-hidden="true"
              data-animation="fadeInLeft"
              data-delay="1.1s"
              style="animation-delay: 1.3s"
            >
              <i class="bi bi-arrow-left-circle fa-3x"></i>
            </span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselId"
            data-bs-slide="next"
          >
            <span
              class="carousel-control-next-icon btn btn-primary fadeInRight animated"
              aria-hidden="true"
              data-animation="fadeInLeft"
              data-delay="1.1s"
              style="animation-delay: 1.3s"
            >
              <i class="bi bi-arrow-right-circle fa-3x"></i>
            </span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
      <!-- Carousel End -->
    </div>
    <!-- Navbar & Hero End -->

    <!-- Modal Search Start -->
    <div
      class="modal fade"
      id="searchModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content rounded-0">
          <div class="modal-header">
            <h4 class="modal-title mb-0" id="exampleModalLabel">Buscar producto o medicamento</h4>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body d-flex align-items-center">
            <div class="input-group w-75 mx-auto d-flex">
              <input
                type="search"
                class="form-control p-3"
                placeholder="Buscar por nombre, principio activo, etc."
                aria-describedby="search-icon-1"
              />
              <span id="search-icon-1" class="input-group-text btn border p-3"
                ><i class="bi bi-search text-primary"></i
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Search End -->

    <!-- feature Start -->
    <div class="container-fluid feature bg-light py-5">
      <div class="container py-5">
        <div
          class="text-center mx-auto pb-5 wow fadeInUp"
          data-wow-delay="0.2s"
          style="max-width: 800px"
        >
          <h4 class="text-uppercase text-primary">Nuestros Beneficios</h4>
          <h1 class="display-3 text-capitalize mb-3">Confianza y calidad en tu farmacia</h1>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
            <div class="feature-item p-4">
              <div class="feature-icon mb-3">
                <i class="bi bi-shield-check text-white" style="font-size: 3rem"></i>
              </div>
              <a href="#" class="h4 mb-3">Control de Calidad</a>
              <p class="mb-3">
                Todos nuestros medicamentos y productos pasan por estrictos controles de calidad.
              </p>
              <a href="#" class="btn text-secondary">Ver más <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.4s">
            <div class="feature-item p-4">
              <div class="feature-icon mb-3">
                <i class="bi bi-capsule text-white" style="font-size: 3rem"></i>
              </div>
              <a href="#" class="h4 mb-3">Variedad de Productos</a>
              <p class="mb-3">
                Encuentra medicamentos, insumos médicos y productos de cuidado personal en un solo
                lugar.
              </p>
              <a href="#" class="btn text-secondary">Ver más <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.6s">
            <div class="feature-item p-4">
              <div class="feature-icon mb-3">
                <i class="bi bi-truck text-white" style="font-size: 3rem"></i>
              </div>
              <a href="#" class="h4 mb-3">Entrega a Domicilio</a>
              <p class="mb-3">
                Recibe tus productos en la puerta de tu casa de forma rápida y segura.
              </p>
              <a href="#" class="btn text-secondary">Ver más <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
            <div class="feature-item p-4">
              <div class="feature-icon mb-3">
                <i class="bi bi-person-badge text-white" style="font-size: 3rem"></i>
              </div>
              <a href="#" class="h4 mb-3">Asesoría Profesional</a>
              <p class="mb-3">
                Consulta gratuita con nuestros farmacéuticos para tu bienestar y el de tu familia.
              </p>
              <a href="#" class="btn text-secondary">Ver más <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- feature End -->

    <!-- About Start -->
    <div id="about" class="container-fluid about overflow-hidden py-5">
      <div class="container-fluid about overflow-hidden py-5">
        <div class="container py-5">
          <div class="row g-5">
            <div class="col-xl-6 wow fadeInLeft" data-wow-delay="0.2s">
              <div class="about-img rounded h-100">
                <img
                  src="/img/home3.jpg"
                  class="img-fluid rounded h-100 w-100"
                  style="object-fit: cover"
                  alt=""
                />
                <div class="about-exp"><span>Experiencia Garantizada</span></div>
              </div>
            </div>
            <div class="col-xl-6 wow fadeInRight" data-wow-delay="0.2s">
              <div class="about-item">
                <h4 class="text-primary text-uppercase">Sobre Nosotros</h4>
                <h1 class="display-3 mb-3">Cuidamos tu salud y la de tu familia</h1>
                <p class="mb-4">
                  Somos una farmacia comprometida con tu bienestar, ofreciendo productos de calidad
                  y atención personalizada para toda la familia.
                </p>
                <div class="bg-light rounded p-4 mb-4">
                  <div class="row">
                    <div class="col-12">
                      <div class="d-flex">
                        <div class="pe-4">
                          <div
                            class="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style="width: 80px; height: 80px"
                          >
                            <i class="bi bi-emoji-smile text-white" style="font-size: 2rem"></i>
                          </div>
                        </div>
                        <div>
                          <a href="#" class="h4 d-inline-block mb-3">Clientes Satisfechos</a>
                          <p class="mb-0">Más de 10,000 clientes confían en nosotros cada año.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-light rounded p-4 mb-4">
                  <div class="row">
                    <div class="col-12">
                      <div class="d-flex">
                        <div class="pe-4">
                          <div
                            class="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style="width: 80px; height: 80px"
                          >
                            <i class="bi bi-capsule text-white" style="font-size: 2rem"></i>
                          </div>
                        </div>
                        <div>
                          <a href="#" class="h4 d-inline-block mb-3">Productos Garantizados</a>
                          <p class="mb-0">
                            Medicamentos y productos originales, con garantía de procedencia.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- About End -->

    <!-- Fact Counter -->
    <div class="container-fluid counter py-5">
      <div class="container py-5">
        <div class="row g-5">
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
            <div class="counter-item">
              <div class="counter-item-icon mx-auto">
                <i class="bi bi-emoji-smile fa-3x text-white"></i>
              </div>
              <h4 class="text-white my-4">Clientes Felices</h4>
              <div class="counter-counting">
                <span class="text-white fs-2 fw-bold" data-toggle="counter-up">456</span>
                <span class="h1 fw-bold text-white">+</span>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.4s">
            <div class="counter-item">
              <div class="counter-item-icon mx-auto">
                <i class="bi bi-capsule fa-3x text-white"></i>
              </div>
              <h4 class="text-white my-4">Productos Disponibles</h4>
              <div class="counter-counting">
                <span class="text-white fs-2 fw-bold" data-toggle="counter-up">513</span>
                <span class="h1 fw-bold text-white">+</span>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.6s">
            <div class="counter-item">
              <div class="counter-item-icon mx-auto">
                <i class="bi bi-truck fa-3x text-white"></i>
              </div>
              <h4 class="text-white my-4">Entregas Realizadas</h4>
              <div class="counter-counting">
                <span class="text-white fs-2 fw-bold" data-toggle="counter-up">320</span>
                <span class="h1 fw-bold text-white">+</span>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
            <div class="counter-item">
              <div class="counter-item-icon mx-auto">
                <i class="bi bi-award fa-3x text-white"></i>
              </div>
              <h4 class="text-white my-4">Años de Experiencia</h4>
              <div class="counter-counting">
                <span class="text-white fs-2 fw-bold" data-toggle="counter-up">5</span>
                <span class="h1 fw-bold text-white">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fact Counter -->

    <!-- Service Start -->
    <div id="services" class="container-fluid service bg-light overflow-hidden py-5">
      <div class="container-fluid service bg-light overflow-hidden py-5">
        <div class="container py-5">
          <div
            class="text-center mx-auto pb-5 wow fadeInUp"
            data-wow-delay="0.2s"
            style="max-width: 800px"
          >
            <h4 class="text-uppercase text-primary">Nuestros Servicios</h4>
            <h1 class="display-3 text-capitalize mb-3">Soluciones para tu salud y bienestar</h1>
          </div>
          <div class="row gx-0 gy-4 align-items-center">
            <div class="col-lg-6 col-xl-4 wow fadeInLeft" data-wow-delay="0.2s">
              <div class="service-item rounded p-4 mb-4">
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex">
                      <div class="service-content text-end">
                        <a href="#" class="h4 d-inline-block mb-3">Toma de Presión</a>
                        <p class="mb-0">
                          Servicio gratuito de medición de presión arterial para el control de tu
                          salud.
                        </p>
                      </div>
                      <div class="ps-4">
                        <div class="service-btn">
                          <i class="bi bi-heart-pulse text-white" style="font-size: 2rem"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="service-item rounded p-4 mb-4">
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex">
                      <div class="service-content text-end">
                        <a href="#" class="h4 d-inline-block mb-3">Aplicación de Inyectables</a>
                        <p class="mb-0">
                          Personal capacitado para la administración segura de inyecciones.
                        </p>
                      </div>
                      <div class="ps-4">
                        <div class="service-btn">
                          <i class="bi bi-bandaid text-white" style="font-size: 2rem"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="service-item rounded p-4 mb-0">
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex">
                      <div class="service-content text-end">
                        <a href="#" class="h4 d-inline-block mb-3">Control de Glucosa</a>
                        <p class="mb-0">
                          Medición rápida de glucosa en sangre para el monitoreo de pacientes
                          diabéticos.
                        </p>
                      </div>
                      <div class="ps-4">
                        <div class="service-btn">
                          <i class="bi bi-droplet-half text-white" style="font-size: 2rem"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.3s">
              <div class="bg-transparent">
                <img src="/img/home4.png" class="img-fluid w-100" alt="" />
              </div>
            </div>
            <div class="col-lg-6 col-xl-4 wow fadeInRight" data-wow-delay="0.2s">
              <div class="service-item rounded p-4 mb-4">
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex">
                      <div class="pe-4">
                        <div class="service-btn">
                          <i class="bi bi-capsule text-white" style="font-size: 2rem"></i>
                        </div>
                      </div>
                      <div class="service-content">
                        <a href="#" class="h4 d-inline-block mb-3">Recetas Magistrales</a>
                        <p class="mb-0">
                          Preparación personalizada de medicamentos según indicación médica.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="service-item rounded p-4 mb-4">
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex">
                      <div class="pe-4">
                        <div class="service-btn">
                          <i class="bi bi-gift text-white" style="font-size: 2rem"></i>
                        </div>
                      </div>
                      <div class="service-content">
                        <a href="#" class="h4 d-inline-block mb-3">Regalos y Accesorios</a>
                        <p class="mb-0">
                          Encuentra productos de cuidado personal, regalos y accesorios para toda
                          ocasión.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="service-item rounded p-4 mb-0">
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex">
                      <div class="pe-4">
                        <div class="service-btn">
                          <i class="bi bi-calendar-check text-white" style="font-size: 2rem"></i>
                        </div>
                      </div>
                      <div class="service-content">
                        <a href="#" class="h4 d-inline-block mb-3">Recordatorio de Medicación</a>
                        <p class="mb-0">
                          Te ayudamos a organizar y recordar tus horarios de medicación.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Service End -->

    <!-- Products Start -->
    <div class="container-fluid product py-5">
      <div class="container py-5">
        <div
          class="text-center mx-auto pb-5 wow fadeInUp"
          data-wow-delay="0.2s"
          style="max-width: 800px"
        >
          <h4 class="text-uppercase text-primary">Nuestros Productos</h4>
          <h1 class="display-3 text-capitalize mb-3">Medicamentos y productos destacados</h1>
        </div>
        <div class="row g-4 justify-content-center">
          <div class="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.2s">
            <div class="product-item">
              <img
                src="/img/home5.jpeg"
                class="img-fluid w-100 rounded-top"
                alt="Paracetamol 500mg"
              />
              <div class="product-content bg-light text-center rounded-bottom p-4">
                <p>Tabletas · 500mg · 20 unidades</p>
                <a href="#" class="h4 d-inline-block mb-3">Paracetamol</a>
                <p class="fs-4 text-primary mb-3">Bs 12.00</p>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.4s">
            <div class="product-item">
              <img
                src="/img/home6-1.png"
                class="img-fluid w-100 rounded-top"
                alt="Ibuprofeno 400mg"
              />
              <div class="product-content bg-light text-center rounded-bottom p-4">
                <p>Cápsulas · 400mg · 24 unidades</p>
                <a href="#" class="h4 d-inline-block mb-3">Ibuprofeno</a>
                <p class="fs-4 text-primary mb-3">Bs 15.00</p>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.6s">
            <div class="product-item">
              <img
                src="/img/home7 - copia.jpg"
                class="img-fluid w-100 rounded-top"
                alt="Vitamina C 1g"
              />
              <div class="product-content bg-light text-center rounded-bottom p-4">
                <p>Efervescente · 1g · 10 tabletas</p>
                <a href="#" class="h4 d-inline-block mb-3">Vitamina C</a>
                <p class="fs-4 text-primary mb-3">Bs 18.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Products End -->

    <!-- Blog Start -->
    <div id="blog" class="container-fluid blog pb-5">
      <div class="container-fluid blog pb-5">
        <div class="container pb-5">
          <div
            class="text-center mx-auto pb-5 wow fadeInUp"
            data-wow-delay="0.2s"
            style="max-width: 800px"
          >
            <h4 class="text-uppercase text-primary">Nuestro Blog</h4>
            <h1 class="display-3 text-capitalize mb-3">Noticias y Consejos de Salud</h1>
          </div>
          <div class="row g-4 justify-content-center">
            <div class="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.2s">
              <div class="blog-item">
                <div class="blog-img">
                  <img
                    src="/img/blog-1.jpg"
                    class="img-fluid rounded-top w-100"
                    alt="Consejos para el invierno"
                  />
                  <div class="blog-date px-4 py-2">
                    <i class="fa fa-calendar-alt me-1"></i> Jun 10 2025
                  </div>
                </div>
                <div class="blog-content rounded-bottom p-4">
                  <a href="#" class="h4 d-inline-block mb-3"
                    >Cuida tu salud en invierno: recomendaciones y productos clave</a
                  >
                  <p>
                    Descubre cómo protegerte de resfríos y gripes en la temporada fría con hábitos
                    saludables y productos de farmacia.
                  </p>
                  <a href="#" class="fw-bold text-secondary"
                    >Leer más <i class="fa fa-angle-right"></i
                  ></a>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.4s">
              <div class="blog-item">
                <div class="blog-img">
                  <img
                    src="/img/blog-2.jpg"
                    class="img-fluid rounded-top w-100"
                    alt="Medicamentos genéricos"
                  />
                  <div class="blog-date px-4 py-2">
                    <i class="fa fa-calendar-alt me-1"></i> May 28 2025
                  </div>
                </div>
                <div class="blog-content rounded-bottom p-4">
                  <a href="#" class="h4 d-inline-block mb-3"
                    >¿Qué son los medicamentos genéricos y por qué elegirlos?</a
                  >
                  <p>
                    Te explicamos las ventajas de los medicamentos genéricos y cómo pueden ayudarte
                    a cuidar tu salud y tu economía.
                  </p>
                  <a href="#" class="fw-bold text-secondary"
                    >Leer más <i class="fa fa-angle-right"></i
                  ></a>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-xl-4 wow fadeInUp" data-wow-delay="0.6s">
              <div class="blog-item">
                <div class="blog-img">
                  <img
                    src="/img/blog-3.jpg"
                    class="img-fluid rounded-top w-100"
                    alt="Control de presión arterial"
                  />
                  <div class="blog-date px-4 py-2">
                    <i class="fa fa-calendar-alt me-1"></i> May 15 2025
                  </div>
                </div>
                <div class="blog-content rounded-bottom p-4">
                  <a href="#" class="h4 d-inline-block mb-3"
                    >La importancia de controlar tu presión arterial</a
                  >
                  <p>
                    Aprende por qué es fundamental monitorear tu presión y cómo hacerlo fácilmente
                    en tu farmacia de confianza.
                  </p>
                  <a href="#" class="fw-bold text-secondary"
                    >Leer más <i class="fa fa-angle-right"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Blog End -->

    <!-- Team Start -->
    <div class="container-fluid team pb-5">
      <div class="container pb-5">
        <div
          class="text-center mx-auto pb-5 wow fadeInUp"
          data-wow-delay="0.2s"
          style="max-width: 800px"
        >
          <h4 class="text-uppercase text-primary">Nuestro Equipo</h4>
          <h1 class="display-3 text-capitalize mb-3">Conoce a nuestros profesionales</h1>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
            <div class="team-item p-4">
              <div class="team-inner rounded">
                <div class="team-img">
                  <img
                    src="/img/home9.jpg"
                    class="img-fluid rounded-top w-100"
                    alt="Farmacéutica"
                  />
                  <div class="team-share">
                    <a class="btn btn-secondary btn-md-square rounded-pill text-white mx-1" href=""
                      ><i class="fas fa-share-alt"></i
                    ></a>
                  </div>
                  <div class="team-icon rounded-pill py-2 px-2">
                    <a class="btn btn-secondary btn-sm-square rounded-pill mx-1" href=""
                      ><i class="fab fa-facebook-f"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-twitter"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-linkedin-in"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-instagram"></i
                    ></a>
                  </div>
                </div>
                <div class="bg-light rounded-bottom text-center py-4">
                  <h4 class="mb-3">Dra. Laura Méndez</h4>
                  <p class="mb-0">Farmacéutica Titular</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.4s">
            <div class="team-item p-4">
              <div class="team-inner rounded">
                <div class="team-img">
                  <img
                    src="/img/home10.jpg"
                    class="img-fluid rounded-top w-100"
                    alt="Auxiliar de farmacia"
                  />
                  <div class="team-share">
                    <a class="btn btn-secondary btn-md-square rounded-pill text-white mx-1" href=""
                      ><i class="fas fa-share-alt"></i
                    ></a>
                  </div>
                  <div class="team-icon rounded-pill py-2 px-2">
                    <a class="btn btn-secondary btn-sm-square rounded-pill mx-1" href=""
                      ><i class="fab fa-facebook-f"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-twitter"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-linkedin-in"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-instagram"></i
                    ></a>
                  </div>
                </div>
                <div class="bg-light rounded-bottom text-center py-4">
                  <h4 class="mb-3">Carlos Rojas</h4>
                  <p class="mb-0">Auxiliar de Farmacia</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.6s">
            <div class="team-item p-4">
              <div class="team-inner rounded">
                <div class="team-img">
                  <img
                    src="/img/home8.jpg"
                    class="img-fluid rounded-top w-100"
                    alt="Encargada de atención"
                  />
                  <div class="team-share">
                    <a class="btn btn-secondary btn-md-square rounded-pill text-white mx-1" href=""
                      ><i class="fas fa-share-alt"></i
                    ></a>
                  </div>
                  <div class="team-icon rounded-pill py-2 px-2">
                    <a class="btn btn-secondary btn-sm-square rounded-pill mx-1" href=""
                      ><i class="fab fa-facebook-f"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-twitter"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-linkedin-in"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-instagram"></i
                    ></a>
                  </div>
                </div>
                <div class="bg-light rounded-bottom text-center py-4">
                  <h4 class="mb-3">María Fernanda Ruiz</h4>
                  <p class="mb-0">Atención al Cliente</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
            <div class="team-item p-4">
              <div class="team-inner rounded">
                <div class="team-img">
                  <img src="/img/home11.png" class="img-fluid rounded-top w-100" alt="Repartidor" />
                  <div class="team-share">
                    <a class="btn btn-secondary btn-md-square rounded-pill text-white mx-1" href=""
                      ><i class="fas fa-share-alt"></i
                    ></a>
                  </div>
                  <div class="team-icon rounded-pill py-2 px-2">
                    <a class="btn btn-secondary btn-sm-square rounded-pill mx-1" href=""
                      ><i class="fab fa-facebook-f"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-twitter"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-linkedin-in"></i
                    ></a>
                    <a class="btn btn-secondary btn-sm-square rounded-pill me-1" href=""
                      ><i class="fab fa-instagram"></i
                    ></a>
                  </div>
                </div>
                <div class="bg-light rounded-bottom text-center py-4">
                  <h4 class="mb-3">José Luis Vargas</h4>
                  <p class="mb-0">Repartidor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Team End -->

    <!-- Testimonial Start -->
    <div class="container-fluid testimonial pb-5">
      <div class="container pb-5">
        <div
          class="text-center mx-auto pb-5 wow fadeInUp"
          data-wow-delay="0.2s"
          style="max-width: 800px"
        >
          <h4 class="text-uppercase text-primary">Testimonios</h4>
          <h1 class="display-3 text-capitalize mb-3">Opiniones de nuestros clientes</h1>
        </div>
        <div class="owl-carousel testimonial-carousel wow fadeInUp" data-wow-delay="0.3s">
          <div class="testimonial-item text-center p-4">
            <p>
              Excelente atención y variedad de productos. Siempre encuentro lo que necesito y el
              personal es muy amable.
            </p>
            <div class="d-flex justify-content-center mb-4">
              <img
                src="/img/testimonial-1.jpg"
                class="img-fluid border border-4 border-primary"
                style="width: 100px; height: 100px; border-radius: 50px"
                alt="Testimonio cliente 1"
              />
            </div>
            <div class="d-block">
              <h4 class="text-dark">Ana Gutiérrez</h4>
              <p class="m-0 pb-3">Cliente frecuente</p>
              <div class="d-flex justify-content-center text-secondary">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
            </div>
          </div>
          <div class="testimonial-item text-center p-4">
            <p>
              Muy buena farmacia, me ayudaron con mis dudas y la entrega a domicilio fue rápida y
              segura.
            </p>
            <div class="d-flex justify-content-center mb-4">
              <img
                src="/img/testimonial-2.jpg"
                class="img-fluid border border-4 border-primary"
                style="width: 100px; height: 100px; border-radius: 50px"
                alt="Testimonio cliente 2"
              />
            </div>
            <div class="d-block">
              <h4 class="text-dark">Luis Fernández</h4>
              <p class="m-0 pb-3">Padre de familia</p>
              <div class="d-flex justify-content-center text-secondary">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
            </div>
          </div>
          <div class="testimonial-item text-center p-4">
            <p>
              Recomiendo esta farmacia por su profesionalismo y la calidad de sus productos.
              ¡Gracias por su servicio!
            </p>
            <div class="d-flex justify-content-center mb-4">
              <img
                src="/img/testimonial-3.jpg"
                class="img-fluid border border-4 border-primary"
                style="width: 100px; height: 100px; border-radius: 50px"
                alt="Testimonio cliente 3"
              />
            </div>
            <div class="d-block">
              <h4 class="text-dark">María López</h4>
              <p class="m-0 pb-3">Paciente crónica</p>
              <div class="d-flex justify-content-center text-secondary">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
            </div>
          </div>
          <div class="testimonial-item text-center p-4">
            <p>
              Siempre recibo una atención cordial y rápida. Los precios son accesibles y el ambiente
              es muy agradable.
            </p>
            <div class="d-flex justify-content-center mb-4">
              <img
                src="/img/home12.png"
                class="img-fluid border border-4 border-primary"
                style="width: 100px; height: 100px; border-radius: 50px"
                alt="Testimonio cliente 4"
              />
            </div>
            <div class="d-block">
              <h4 class="text-dark">Jorge Salazar</h4>
              <p class="m-0 pb-3">Cliente</p>
              <div class="d-flex justify-content-center text-secondary">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Testimonial End -->

    <!-- Footer Start -->
    <div id="contact" class="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
      <div class="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
        <div class="container py-5">
          <div class="row g-5 mb-5 align-items-center">
            <div class="col-lg-7">
              <div class="position-relative mx-auto">
                <input
                  class="form-control rounded-pill w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder="Correo electrónico para suscribirse"
                />
                <button
                  type="button"
                  class="btn btn-secondary rounded-pill position-absolute top-0 end-0 py-2 px-4 mt-2 me-2"
                >
                  Suscribirse
                </button>
              </div>
            </div>
            <div class="col-lg-5">
              <div class="d-flex align-items-center justify-content-center justify-content-lg-end">
                <a class="btn btn-secondary btn-md-square rounded-circle me-3" href="">
                  <i class="bi bi-facebook"></i>
                </a>
                <a class="btn btn-secondary btn-md-square rounded-circle me-3" href="">
                  <i class="bi bi-twitter"></i>
                </a>
                <a class="btn btn-secondary btn-md-square rounded-circle me-3" href="">
                  <i class="bi bi-instagram"></i>
                </a>
                <a class="btn btn-secondary btn-md-square rounded-circle me-0" href="">
                  <i class="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="row g-5">
            <div class="col-md-6 col-lg-6 col-xl-3">
              <div class="footer-item d-flex flex-column">
                <div class="footer-item">
                  <h3 class="text-white mb-4">
                    <i class="bi bi-capsule-pill text-primary me-3"></i>Farmacia Salud Total
                  </h3>
                  <p class="mb-3">
                    Tu farmacia de confianza: calidad, atención profesional y productos garantizados
                    para tu bienestar.
                  </p>
                </div>
                <div class="position-relative">
                  <input
                    class="form-control rounded-pill w-100 py-3 ps-4 pe-5"
                    type="text"
                    placeholder="Ingresa tu email"
                  />
                  <button
                    type="button"
                    class="btn btn-secondary rounded-pill position-absolute top-0 end-0 py-2 mt-2 me-2"
                  >
                    Suscribirse
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-3">
              <div class="footer-item d-flex flex-column">
                <h4 class="text-white mb-4">Enlaces Rápidos</h4>
                <a href="#"><i class="bi bi-chevron-right me-2"></i> ¿Por qué elegirnos?</a>
                <a href="#"><i class="bi bi-chevron-right me-2"></i> Productos destacados</a>
                <a href="#"><i class="bi bi-chevron-right me-2"></i> Servicios</a>
                <a href="#"><i class="bi bi-chevron-right me-2"></i> Equipo</a>
                <a href="#"><i class="bi bi-chevron-right me-2"></i> Contacto</a>
                <a href="#"><i class="bi bi-chevron-right me-2"></i> Términos y condiciones</a>
              </div>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-3">
              <div class="footer-item d-flex flex-column">
                <h4 class="text-white mb-4">Horarios de Atención</h4>
                <div class="mb-3">
                  <h6 class="text-muted mb-0">Lunes a Viernes:</h6>
                  <p class="text-white mb-0">09:00 am a 07:00 pm</p>
                </div>
                <div class="mb-3">
                  <h6 class="text-muted mb-0">Sábado:</h6>
                  <p class="text-white mb-0">10:00 am a 05:00 pm</p>
                </div>
                <div class="mb-3">
                  <h6 class="text-muted mb-0">Domingo:</h6>
                  <p class="text-white mb-0">Cerrado</p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-3">
              <div class="footer-item d-flex flex-column">
                <h4 class="text-white mb-4">Contacto</h4>
                <a href="#"><i class="bi bi-geo-alt me-2"></i> Av. Principal 123, Ciudad</a>
                <a href="mailto:info@farmacia.com">
                  <i class="bi bi-envelope me-2"></i> info@farmacia.com
                </a>
                <a href="tel:+591123456789"
                  ><i class="bi bi-telephone me-2"></i> +591 123 456 789</a
                >
                <a href="tel:+591123456789" class="mb-3">
                  <i class="bi bi-printer me-2"></i> +591 123 456 789
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer End -->

    <!-- Copyright Start -->
    <div class="container-fluid copyright py-4">
      <div class="container">
        <div class="row g-4 align-items-center">
          <div class="col-md-6 text-center text-md-start mb-md-0">
            <span class="text-body">
              <a href="#" class="border-bottom text-white">
                <i class="bi bi-c-circle text-light me-2"></i>Farmacia Salud Total
              </a>
              , Todos los derechos reservados.
            </span>
          </div>
          <div class="col-md-6 text-center text-md-end text-body">
            <!--/*** Este template es gratuito mientras mantengas el crédito del autor. ***/-->
            Diseñado por
            <a class="border-bottom text-white" href="https://htmlcodex.com">HTML Codex</a>
            Distribuido por
            <a class="border-bottom text-white" href="https://themewagon.com">ThemeWagon</a>
          </div>
        </div>
      </div>
    </div>
    <!-- Copyright End -->

    <!-- Back to Top -->
    <a href="#" class="btn btn-secondary btn-lg-square rounded-circle back-to-top">
      <i class="bi bi-arrow-up"></i>
    </a>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wdth,wght@0,75..100,300..800;1,75..100,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
@import url('https://use.fontawesome.com/releases/v5.15.4/css/all.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import '/lib/animate/animate.min.css';
@import '/lib/owlcarousel/assets/owl.carousel.min.css';
@import '/lib/owlcarousel/assets/owl.carousel.css';
@import '/css/bootstrap.min.css';
@import '/css/style.css';
</style>
