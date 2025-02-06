const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const sum = canvas.width + canvas.height;
const numDots = Math.floor(sum / 25);
const dotRadius = numDots;
const speed = (sum / 200);
const lineWidth = 1;
const canvasColor = "#1b2423";
const glowRadius = 10;
const colors = ['#007acc', '#6a51a3', '#00ff00', '#82ffb6', '#61f4ff', '#8e61ff', '#ff00bb', '#9cb1ff', '#80ffb7', '#40ff93'];
let colorIndex = 0;

function clearCanvas() {
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.onload = function() {
    if (!localStorage.getItem('hasLoadedOnce')) {
        localStorage.setItem('hasLoadedOnce', true);
        location.reload();
    } else {
        localStorage.removeItem('hasLoadedOnce');
    }
};

class Point {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 3;
        this.dx = this.randD();
        this.dy = this.randD();
        this.color = this.getNextColor();
    }

    randD() {
        return (Math.random() - 0.5) * speed;
    }

    getNextColor() {
        colorIndex = (colorIndex + 1) % colors.length;
        return colors[colorIndex];
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = glowRadius;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.closePath();
    }

    reverseDirection() {
        this.dx = -this.dx;
        this.dy = -this.dy;
    }

    updateGraphics(points) {
        if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
            this.reverseDirection();
        }
        if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {
            this.reverseDirection();
        }

        for (let point of points) {
            if (point === this) continue;
            const dx = point.x - this.x;
            const dy = point.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < dotRadius) {
                const gradient = ctx.createLinearGradient(this.x, this.y, point.x, point.y);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, point.color);

                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = lineWidth * (dotRadius - distance) / dotRadius;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.closePath();
            }
            if (distance < this.radius + point.radius) {
                this.reverseDirection();
                break;
            }
        }

        this.x += this.dx;
        this.y += this.dy;
    }
}

// Precreate points array and reuse it
const points = Array.from({ length: numDots }, () => new Point());

function animateAll() {
    clearCanvas();
    points.forEach(point => {
        point.updateGraphics(points);
        point.draw();
    });
    requestAnimationFrame(animateAll);
}

animateAll();