export default function AnimatedBackground() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let sum = canvas.width + canvas.height;
    let numDots = sum / 25;
    let dotRadius = numDots + 40;
    let speed = (sum / 2500) + 4;
    let lineWidth = 1;
    let canvasColor = "#1b2423";
    let glowRadius = 10;
    let colors = ['#007acc', '#6a51a3', '#00ff00', '#82ffb6', '#61f4ff', '#8e61ff', '#ff00bb', '#9cb1ff', '#80ffb7', '#40ff93'];
    let colorIndex = 0;

    function clearCanvas() {
        ctx.fillStyle = canvasColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    window.onload = function () {
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

        updateGraphics() {
            if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
                this.reverseDirection();
            }
            if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {
                this.reverseDirection();
            }

            for (let point of points) {
                if (point === this) continue;
                let distance = Math.sqrt(Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2));
                if (distance < dotRadius) {
                    let gradient = ctx.createLinearGradient(this.x, this.y, point.x, point.y);
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

    let points = [];
    for (let i = 0; i < numDots; i++) {
        points.push(new Point());
    }

    function animateAll() {
        clearCanvas();
        points.forEach(point => {
            point.updateGraphics();
            point.draw();
        });
        requestAnimationFrame(animateAll);
    }

    animateAll();
}