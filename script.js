const canvas = document.getElementById('meuGrafico');
const ctx = canvas.getContext('2d');
const infoTexto = document.getElementById('infoTexto');
const slots = document.querySelectorAll('.slot');

const labels = ['8:58', '9:00', '9:02', '9:04', '9:06', '9:08', '9:10', '9:12', '9:14', '9:16', '9:18', '9:20'];

const dashboardData = {
    'Temperatura': {
        type: 'chart',
        title: 'Temperatura [°C]',
        data: [22.1, 22.3, 22.5, 22.4, 22.2, 22.1, 22.0, 22.3, 22.6, 22.8, 22.7, 22.5],
        avgData: [22.0, 22.2, 22.3, 22.4, 22.3, 22.2, 22.1, 22.2, 22.4, 22.6, 22.7, 22.6],
        min: 20,
        max: 25
    },
    'Umidade': {
        type: 'chart',
        title: 'Umidade Relativa [%]',
        data: [55.0, 54.5, 54.0, 53.5, 55.0, 56.5, 57.0, 56.0, 55.5, 54.5, 54.0, 53.0],
        avgData: [55.2, 54.8, 54.3, 53.8, 54.2, 55.5, 56.2, 56.5, 55.8, 55.0, 54.3, 53.5],
        min: 50,
        max: 60
    },
    'Pressão Atmosferica': {
        type: 'chart',
        title: 'Pressão Atmosférica [hPa]',
        data: [1013.0, 1013.5, 1012.4, 1013.4, 1012.3, 1013.2, 1012.6, 1013.6, 1012.4, 1013.6, 1012.5, 1013.3],
        avgData: [1013.0, 1013.2, 1012.8, 1013.1, 1012.6, 1012.9, 1012.7, 1013.2, 1012.8, 1013.1, 1012.9, 1013.0],
        min: 1011.9,
        max: 1014.1
    },
    'Altitude': {
        type: 'chart',
        title: 'Altitude [m]',
        data: [750, 751, 749, 750, 752, 751, 750, 748, 749, 750, 751, 752],
        avgData: [750.5, 750.8, 750.0, 749.5, 751.0, 751.5, 750.5, 749.0, 748.5, 749.5, 750.5, 751.5],
        min: 740,
        max: 760
    },
    'Data': {
        type: 'text',
        value: 'Quarta-feira, 16 de Setembro de 2026'
    },
    'Nome do Dispositivo': {
        type: 'text',
        value: 'Termostera Node #01 - Vila Mariana'
    }
};

let currentConfig = dashboardData['Pressão Atmosferica']; 
let isChartMode = true;

slots.forEach(slot => {
    slot.addEventListener('click', () => {
        slots.forEach(s => s.classList.remove('active'));
        slot.classList.add('active');

        const abaNome = slot.querySelector('h3').innerText;
        currentConfig = dashboardData[abaNome];

        if (currentConfig.type === 'text') {
            isChartMode = false;
            canvas.style.display = 'none';
            infoTexto.style.display = 'block';
            infoTexto.innerHTML = `<strong>${abaNome}</strong> <br> ${currentConfig.value}`;
        } 
        else {
            isChartMode = true;
            canvas.style.display = 'block';
            infoTexto.style.display = 'none';
            resizeCanvas(); 
        }
    });
});

function resizeCanvas() {
    if(!isChartMode) return; 
    
    canvas.width = canvas.parentElement.clientWidth - 20; 
    canvas.height = canvas.parentElement.clientHeight - 20;
    drawChart();
}

function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const paddingX = 40;
    const paddingYTop = 40;
    const paddingYBottom = 40;
    const chartWidth = canvas.width - paddingX - 10;
    const chartHeight = canvas.height - paddingYTop - paddingYBottom;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "IBM Plex Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentConfig.title, canvas.width / 2, 15);

    ctx.fillStyle = '#cacaca';
    ctx.font = '10px "IBM Plex Mono", sans-serif';
    ctx.textAlign = 'right';
    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
        const value = currentConfig.min + ((currentConfig.max - currentConfig.min) / ySteps) * i;
        const yPos = paddingYTop + chartHeight - (i / ySteps) * chartHeight;
        
        ctx.fillText(value.toFixed(1).replace('.', ','), paddingX - 5, yPos + 4);

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.moveTo(paddingX, yPos);
        ctx.lineTo(paddingX + chartWidth, yPos);
        ctx.stroke();
    }
    ctx.textAlign = 'right';
    labels.forEach((label, i) => {
        const xPos = paddingX + (i / (labels.length - 1)) * chartWidth;
        const yPos = canvas.height - 10;
        
        ctx.save();
        ctx.translate(xPos, yPos);
        ctx.rotate(-Math.PI / 4); 
        ctx.fillText(label, 0, 0);
        ctx.restore();
    });

    drawLine(currentConfig.avgData, '#777777', 1.5, false, paddingX, paddingYTop, chartWidth, chartHeight);
    drawLine(currentConfig.data, '#ce1010', 2.5, true, paddingX, paddingYTop, chartWidth, chartHeight);
}

function drawLine(dataset, color, width, drawPoints, pX, pYTop, cWidth, cHeight) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    
    dataset.forEach((val, i) => {
        const xPos = pX + (i / (dataset.length - 1)) * cWidth;
        const yPos = pYTop + cHeight - ((val - currentConfig.min) / (currentConfig.max - currentConfig.min)) * cHeight;
        
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
    });
    ctx.stroke();

    if (drawPoints) {
        ctx.fillStyle = color;
        dataset.forEach((val, i) => {
            const xPos = pX + (i / (dataset.length - 1)) * cWidth;
            const yPos = pYTop + cHeight - ((val - currentConfig.min) / (currentConfig.max - currentConfig.min)) * cHeight;
            
            ctx.beginPath();
            ctx.arc(xPos, yPos, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();