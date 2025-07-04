const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const light = new THREE.PointLight(0xffffff, 2, 300);
light.position.set(0, 0, 0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(8, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Background Stars
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.4 });

function createStars(count = 500) {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.4 });

    const starVertices = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

createStars();

// Planets
const planetsData = [
    { name: 'Mercury', color: 0x888888, size: 0.8, distance: 9, speed: 0.04 },
    { name: 'Venus', color: 0xffa07a, size: 1, distance: 11, speed: 0.03 },
    { name: 'Earth', color: 0x1e90ff, size: 1.2, distance: 13, speed: 0.02 },
    { name: 'Mars', color: 0xff6347, size: 1.1, distance: 15, speed: 0.018 },
    { name: 'Jupiter', color: 0xd2b48c, size: 2.8, distance: 18, speed: 0.01 },
    { name: 'Saturn', color: 0xf0e68c, size: 2.4, distance: 22, speed: 0.009 },
    { name: 'Uranus', color: 0x87cefa, size: 1.8, distance: 26, speed: 0.007 },
    { name: 'Neptune', color: 0x4169e1, size: 1.7, distance: 30, speed: 0.006 },
];

const planets = [];
const angles = {};

planetsData.forEach((data) => {
    const geo = new THREE.SphereGeometry(data.size, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: data.color });
    const planet = new THREE.Mesh(geo, mat);
    scene.add(planet);
    planets.push({ ...data, mesh: planet });
    angles[data.name] = Math.random() * Math.PI * 2;
});

camera.position.z = 80;

// Speed Sliders
const sliderContainer = document.querySelector(".slider-container");
planets.forEach((p) => {
    const label = document.createElement("label");
    label.innerText = `${p.name} Speed:`;
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "0.1";
    input.step = "0.001";
    input.value = p.speed;
    input.oninput = (e) => {
        p.speed = parseFloat(e.target.value);
    };
    sliderContainer.appendChild(label);
    sliderContainer.appendChild(input);
});

// Theme Toggle
const themeBtn = document.getElementById("toggle-theme");
let isDark = true;

themeBtn.addEventListener("click", () => {
    isDark = !isDark;
    document.body.classList.toggle("light-mode", !isDark);
        themeBtn.innerHTML = isDark
        ? '<i class="fas fa-moon"></i> Dark Mode'
        : '<i class="fas fa-sun"></i> Light Mode';

    scene.background = new THREE.Color(isDark ? 0x000000 : 0xf2f2f2);
    sun.material.color.set(isDark ? 0xfdb813 : 0xffd34d);
});


// Pause/Resume Toggle
const toggleAnimationBtn = document.getElementById("toggle-animation");
let isPaused = false;

toggleAnimationBtn.addEventListener("click", () => {
    isPaused = !isPaused;
        toggleAnimationBtn.innerHTML = isPaused
        ? '<i class="fas fa-play"></i> Resume'
        : '<i class="fas fa-pause"></i> Pause'; 
});

// Animate
function animate() {
    requestAnimationFrame(animate);

    if (!isPaused) {
        planets.forEach((p) => {
        angles[p.name] += p.speed;
        p.mesh.position.x = p.distance * Math.cos(angles[p.name]);
        p.mesh.position.z = p.distance * Math.sin(angles[p.name]);
        });
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});
