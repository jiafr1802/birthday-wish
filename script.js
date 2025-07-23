// 音乐控制
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        isMusicPlaying = false;
    } else {
        bgMusic.play().catch(e => console.log('音乐播放失败:', e));
        musicToggle.textContent = '🎵';
        isMusicPlaying = true;
    }
});

// 烟花效果
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff9ff3', '#a8e6cf', '#ff8b94'];
        this.createParticles();
    }

    createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 2 + Math.random() * 3;
            const particle = {
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                life: 1,
                decay: 0.02 + Math.random() * 0.02
            };
            this.particles.push(particle);
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // 重力
            particle.life -= particle.decay;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    isDead() {
        return this.particles.length === 0;
    }
}

// 烟花画布
const fireworksContainer = document.getElementById('fireworks');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '0';

fireworksContainer.appendChild(canvas);

let fireworks = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.5;
    fireworks.push(new Firework(x, y));
}

function animateFireworks() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制烟花
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw(ctx);
        
        if (fireworks[i].isDead()) {
            fireworks.splice(i, 1);
        }
    }

    // 随机创建新烟花
    if (Math.random() < 0.05) {
        createFirework();
    }

    animationId = requestAnimationFrame(animateFireworks);
}

// 初始化烟花
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateFireworks();

// 编辑功能
const editBtn = document.getElementById('editBtn');
const editModal = document.getElementById('editModal');
const messageInput = document.getElementById('messageInput');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const customMessages = document.querySelectorAll('.custom-message');

// 获取当前消息文本
function getCurrentMessages() {
    return Array.from(customMessages).map(msg => msg.textContent).join('\n');
}

// 设置消息文本
function setMessages(text) {
    const lines = text.split('\n').filter(line => line.trim());
    customMessages.forEach((msg, index) => {
        if (lines[index]) {
            msg.textContent = lines[index];
        }
    });
}

// 打开编辑模态框
editBtn.addEventListener('click', () => {
    messageInput.value = getCurrentMessages();
    editModal.style.display = 'block';
});

// 保存编辑
saveBtn.addEventListener('click', () => {
    setMessages(messageInput.value);
    editModal.style.display = 'none';
    
    // 重新触发动画
    customMessages.forEach((msg, index) => {
        msg.style.animation = 'none';
        msg.offsetHeight; // 触发重排
        msg.style.animation = `fadeInUp 0.8s ease forwards ${0.2 + index * 0.2}s`;
    });
});

// 取消编辑
cancelBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// 点击模态框外部关闭
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editModal.style.display === 'block') {
        editModal.style.display = 'none';
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 自动播放音乐（需要用户交互）
    document.addEventListener('click', () => {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                musicToggle.textContent = '🎵';
                isMusicPlaying = true;
            }).catch(e => console.log('音乐播放失败:', e));
        }
    }, { once: true });

    // 添加一些初始烟花
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createFirework(), i * 500);
        }
    }, 1000);
});

// 蛋糕蜡烛闪烁效果增强
function enhanceCakeAnimation() {
    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        flame.style.animationDelay = `${index * 0.2}s`;
    });
}

enhanceCakeAnimation();

// 添加鼠标点击烟花效果
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    fireworks.push(new Firework(x, y));
});

// 添加键盘烟花效果
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        fireworks.push(new Firework(x, y));
        e.preventDefault();
    }
});

// 性能优化：限制烟花数量
function limitFireworks() {
    if (fireworks.length > 10) {
        fireworks.splice(0, fireworks.length - 10);
    }
}

setInterval(limitFireworks, 1000); 