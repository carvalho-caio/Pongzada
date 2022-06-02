const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

//player
const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

//inimigo
const com = {
    x: canvas.width - 10,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

//bola
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 8,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
}

//rede
const net = {
    x: canvas.width/2 -1,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE"
}

//desenhar a rede
function drawNet()
{
    for(let i = 0; i <= canvas.height; i+=15)
    {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}


//desenhar retangulo
function drawRect(x, y, w, h, color)
{
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

drawRect(0, 0, canvas.width, canvas.height, "BLACK");

//desenhar circulo
function drawCircle(x, y, r, color)
{
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

drawCircle(100, 100, 50, "WHITE");

//desenhar texto
function drawText(text, x, y, color)
{
    context.fillStyle = color;
    context.font = "38px fantasy";
    context.fillText(text, x, y);
}

drawText("test", 300, 200, "WHITE");

//renderizar o jogo
function render()
{
    //limpar o canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");

    //desenhar a rede
    drawNet();

    //desenhar o placar
    drawText(user.score, canvas.width/4, canvas.height/5, "WHITE")
    drawText(com.score, 3 * canvas.width/4, canvas.height/5, "WHITE")

    //desenhar os jogadores
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //desenhar a bola
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//controle do jogador e da IA
function movePaddle(evt)
{
    //eu não tenho a menor ideia do que isso faz, mas sem isso não funciona
    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}

canvas.addEventListener("mousemove", movePaddle);


//detecção de colisão
function collision (b, p)
{
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

//resetar a posição da bola pro meio
function resetBall()
{
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

//funcao update, com a lógica do jogo
function update()
{
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //controle da IA
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
    {
        //se encostar em algum canto, inverte a velocidade
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width/2) ? user : com;
    
    if(collision(ball, player))
    {
        //onde a bola encosta no jogador
        let collidePoint = ball.y - (player.y + player.height/2)

        //normalizar
        collidePoint = collidePoint/(player.height/2);

        //calcular o angulo
        let angleRad = collidePoint * Math.PI / 4;

        // direção X da bola quando ela colide
        let direction = (ball.x < canvas.height/2) ? 1 : -1;

        //mudar velocidade de X e de Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);

        //sempre que a bola acerta um dos jogadores, aumenta a velocidade
        ball.speed += 0.3;
    }

    //update no score
    if(ball.x - ball.radius < 0)
    {
        //ponto da IA
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width)
    {
        //ponto do player
        user.score++;
        resetBall();
    }
}


//iniciar o jogo
function game()
{
    update();
    render();
}

//frames por segundo
const framePerSecond = 50;

//inicializando o codigo
setInterval(game, 1000/framePerSecond);