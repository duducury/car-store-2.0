// Toggle Menu for Mobile
function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

const slides = document.querySelectorAll('.carousel-item');
const thumbnails = document.querySelectorAll('.thumbnail');
let currentIndex = 0;
const slideInterval = 3000; // 3 seconds

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.opacity = i === index ? '1' : '0';
        slide.style.zIndex = i === index ? '1' : '0';
    });

    // Highlight the active thumbnail
    thumbnails.forEach((thumbnail, i) => {
        thumbnail.classList.toggle('active', i === index);
    });
}

// Initialize the opacity of each slide and apply CSS transition
slides.forEach(slide => {
    slide.style.opacity = '0';
    slide.style.transition = 'opacity 1s ease';
});
showSlide(currentIndex);

function startCarousel() {
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, slideInterval);
}

thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
    });
});

document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
});

startCarousel();

// Mouse Follow Animation on Carousel Items
document.querySelectorAll('.carousel-item').forEach(item => {
    let xOffset = 0;
    let yOffset = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    const updatePosition = () => {
        if (!isHovering) return;
        const { width, height } = item.getBoundingClientRect();

        // Calculate the smooth transition position for the text
        const smoothXOffset = -(mouseX / width - 0.5) * 30;
        const smoothYOffset = -(mouseY / height - 0.5) * 30;

        // Apply slight easing to the animation
        xOffset += (smoothXOffset - xOffset) * 0.1;
        yOffset += (smoothYOffset - yOffset) * 0.1;

        // Update the carousel content position
        item.querySelector('.carousel-content').style.transform = `translate(${xOffset}px, ${yOffset}px)`;

        requestAnimationFrame(updatePosition);
    };

    item.addEventListener('mouseenter', () => {
        isHovering = true;
        requestAnimationFrame(updatePosition);
    });

    item.addEventListener('mousemove', (event) => {
        const { left, top } = item.getBoundingClientRect();
        mouseX = event.clientX - left;
        mouseY = event.clientY - top;
    });

    item.addEventListener('mouseleave', () => {
        isHovering = false;
        xOffset = 0;
        yOffset = 0;
        item.querySelector('.carousel-content').style.transform = 'translate(0, 0)';
    });
});





async function loadCSV(file) {
    const response = await fetch(file);
    const data = await response.text();
    return data;
}

function parseCSV(data) {
    const rows = data.split('\n');
    const headers = rows[0].split(',').map(header => header.trim());
    const columnIndex = {};

    // Mapeia o índice de cada coluna com base no cabeçalho
    headers.forEach((header, index) => {
        columnIndex[header] = index;
    });

    return rows.slice(1).map(row => {
        const columns = row.split(',');

        // Verificação para evitar itens indefinidos e garantir que Preco esteja presente
        if (
            columns[columnIndex['ID']] &&
            columns[columnIndex['Nome']] &&
            columns[columnIndex['Preco']]
        ) {
            return {
                ID: columns[columnIndex['ID']],
                Nome: columns[columnIndex['Nome']],
                Link: columns[columnIndex['Link']],
                Imagem1: columns[columnIndex['Imagem1']],
                Ano: columns[columnIndex['Ano']],
                Km: columns[columnIndex['Km']],
                Motor: columns[columnIndex['Motor']],
                Cambio: columns[columnIndex['Cambio']],
                Combustivel: columns[columnIndex['Combustivel']],
                Preco: columns[columnIndex['Preco']]
            };
        }
        return null; // Retorna null se algum dado essencial estiver faltando
    }).filter(car => car !== null); // Filtra valores nulos
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


async function displayInventory() {
    const csvData = await loadCSV('imgs/Carros_Completo.csv');
    let cars = parseCSV(csvData);
    cars = shuffleArray(cars); // Embaralha os carros
    renderInventory(cars);
}


document.addEventListener('DOMContentLoaded', displayInventory);








// Navbar Scroll Visibility
let lastScrollPosition = 0;
let isScrolling;
const navbar = document.querySelector('.navbar');

// Function to hide the navbar after a timeout if not scrolling
function hideNavbar() {
    if (window.scrollY > 0) { // Only hide if we're not at the top
        navbar.classList.add('hidden');
    }
}

// Event listener for scrolling
window.addEventListener('scroll', () => {
    // Clear timeout when scrolling
    clearTimeout(isScrolling);

    // Show the navbar when scrolling or moving upwards
    navbar.classList.remove('hidden');

    // Set a timeout to hide the navbar if the user stops scrolling
    isScrolling = setTimeout(hideNavbar, 2000); // Adjust delay as needed

    // Detect scrolling direction
    const currentScrollPosition = window.scrollY;
    if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 0) {
        // User is scrolling down and not at the top
        navbar.classList.add('hidden');
    } else {
        // User is scrolling up or at the top
        navbar.classList.remove('hidden');
    }

    // Update last scroll position
    lastScrollPosition = currentScrollPosition;
});

// Show navbar on mouse hover
navbar.addEventListener('mouseenter', () => {
    navbar.classList.remove('hidden');
});
async function loadCSV(file) {
    const response = await fetch(file);
    const data = await response.text();
    return data;
}


function renderInventory(cars) {
    const inventoryGrid = document.getElementById('inventory-grid');
    inventoryGrid.innerHTML = ''; // Limpa o conteúdo atual

    cars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.classList.add('car-card');

        const imagePath = `imgs/cars/carro${car.ID}/${car.Imagem1}`;

        carElement.innerHTML = `
            <div class="car-image">
                <a href="car-detail.html?id=${car.ID}">
                    <img src="${imagePath}" alt="${car.Nome}" />
                </a>
            </div>
            <div class="car-details">
                <h3 class="car-name">${car.Nome}</h3>
                <p class="car-price">${car.Preco}</p>
                <div class="car-specs">
                    <span class="car-spec">${car.Ano}</span>
                    <span class="car-spec">${car.Km}</span>
                    <span class="car-spec">${car.Cambio}</span>
                    <span class="car-spec">${car.Combustivel}</span>
                </div>

                <button class="view-details-btn" onclick="goToDetails('${car.ID}')">Ver Detalhes</button>
            
            </div>
        `;
        inventoryGrid.appendChild(carElement);
    });
}

function goToDetails(carId) {
    window.location.href = `car-detail.html?id=${carId}`;
}


document.addEventListener('DOMContentLoaded', async () => {
    await displayInventory();

    const inventoryGrid = document.getElementById('inventory-grid');
    const prevInventory = document.getElementById('prevInventory');
    const nextInventory = document.getElementById('nextInventory');

    // Certifique-se de que os produtos foram carregados antes de definir a largura do produto
    const productWidth = inventoryGrid.querySelector('.car-card').offsetWidth;
    const scrollAmount = productWidth * 4; // Calcula a largura total de 4 produtos

    prevInventory.addEventListener('click', () => {
        inventoryGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextInventory.addEventListener('click', () => {
        inventoryGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
});
const inventoryGrid = document.getElementById('inventory-grid');

let isDown = false;
let startX;
let scrollLeft;

inventoryGrid.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - inventoryGrid.offsetLeft;
    scrollLeft = inventoryGrid.scrollLeft;
    inventoryGrid.style.cursor = 'grabbing';
});

inventoryGrid.addEventListener('mouseleave', () => {
    isDown = false;
    inventoryGrid.style.cursor = 'default';
});

inventoryGrid.addEventListener('mouseup', () => {
    isDown = false;
    inventoryGrid.style.cursor = 'default';
});

inventoryGrid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - inventoryGrid.offsetLeft;
    const walk = (x - startX) * 2; // Multiplique por 2 para aumentar a sensibilidade do arraste
    inventoryGrid.scrollLeft = scrollLeft - walk;
});





document.addEventListener('DOMContentLoaded', () => {
    // Selecionar todas as imagens na galeria de trabalho
    const workImages = document.querySelectorAll('.work-gallery .work-item img');
    const lightbox = document.createElement('div'); // Criar o lightbox dinamicamente
    lightbox.id = 'lightbox';
    lightbox.style.display = 'none';
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.background = 'rgba(0, 0, 0, 0.9)';
    lightbox.style.flexDirection = 'column'; // Para empilhar o conteúdo no eixo vertical
    lightbox.style.justifyContent = 'center';
    lightbox.style.alignItems = 'center';
    lightbox.style.zIndex = '1000';

    // Adicionar conteúdo ao lightbox
    const lightboxImage = document.createElement('img');
    lightboxImage.style.maxWidth = '80%';
    lightboxImage.style.maxHeight = '80%';

    const closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '30px';
    closeButton.style.color = '#fff';
    closeButton.style.fontSize = '30px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    const prevButton = document.createElement('button');
    prevButton.textContent = '‹';
    prevButton.style.position = 'absolute';
    prevButton.style.top = '50%';
    prevButton.style.left = '10px';
    prevButton.style.color = '#fff';
    prevButton.style.background = 'none';
    prevButton.style.border = 'none';
    prevButton.style.fontSize = '40px';
    prevButton.style.cursor = 'pointer';

    const nextButton = document.createElement('button');
    nextButton.textContent = '›';
    nextButton.style.position = 'absolute';
    nextButton.style.top = '50%';
    nextButton.style.right = '10px';
    nextButton.style.color = '#fff';
    nextButton.style.background = 'none';
    nextButton.style.border = 'none';
    nextButton.style.fontSize = '40px';
    nextButton.style.cursor = 'pointer';

    // Barra de miniaturas
    const thumbnailBar = document.createElement('div');
    thumbnailBar.style.position = 'absolute';
    thumbnailBar.style.bottom = '20px';
    thumbnailBar.style.left = '0';
    thumbnailBar.style.width = '100%';
    thumbnailBar.style.display = 'flex';
    thumbnailBar.style.justifyContent = 'center';
    thumbnailBar.style.gap = '10px';
    thumbnailBar.style.overflowX = 'auto';

    lightbox.appendChild(closeButton);
    lightbox.appendChild(prevButton);
    lightbox.appendChild(nextButton);
    lightbox.appendChild(lightboxImage);
    lightbox.appendChild(thumbnailBar);
    document.body.appendChild(lightbox);

    let currentImageIndex = 0;

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = workImages[currentImageIndex].src;
        lightbox.style.display = 'flex';
        updateThumbnailHighlight();
    }

    function changeImage(direction) {
        currentImageIndex = (currentImageIndex + direction + workImages.length) % workImages.length;
        lightboxImage.src = workImages[currentImageIndex].src;
        updateThumbnailHighlight();
    }

    function updateThumbnailHighlight() {
        const thumbnails = thumbnailBar.querySelectorAll('img');
        thumbnails.forEach((thumbnail, idx) => {
            thumbnail.style.border = idx === currentImageIndex ? '2px solid #fff' : 'none';
        });
    }

    prevButton.addEventListener('click', () => changeImage(-1));
    nextButton.addEventListener('click', () => changeImage(1));

    workImages.forEach((img, index) => {
        // Criar miniaturas para o lightbox
        const thumbnail = document.createElement('img');
        thumbnail.src = img.src;
        thumbnail.style.width = '60px';
        thumbnail.style.height = '40px';
        thumbnail.style.objectFit = 'cover';
        thumbnail.style.cursor = 'pointer';

        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            lightboxImage.src = workImages[currentImageIndex].src;
            updateThumbnailHighlight();
        });

        thumbnailBar.appendChild(thumbnail);

        img.addEventListener('click', () => openLightbox(index));
    });

    // Fechar o lightbox clicando fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
});



var words = [
    'Marcelo Tripa Especialista em Importação de Carros Exclusivos para o Brasil',
    'Seu Sonho de Possuir um Carro Exclusivo Está ao seu Alcance.',
    'Entre em Contato Agora Mesmo com Marcelo Tripa!'
];
var part,
    i = 0,
    offset = 0,
    len = words.length,
    forwards = true,
    skip_count = 0,
    skip_delay = 15,
    speed = 70;

var wordflick = function () {
    setInterval(function () {
        if (forwards) {
            if (offset >= words[i].length) {
                ++skip_count;
                if (skip_count == skip_delay) {
                    forwards = false;
                    skip_count = 0;
                }
            }
        } else {
            // Once the phrase is fully written, reset without deleting characters
            forwards = true;
            i++;
            offset = 0;
            if (i >= len) {
                i = 0;
            }
        }
        
        part = words[i].substr(0, offset);
        
        if (skip_count == 0) {
            if (forwards) {
                offset++;
            }
        }
        
        $('.word').text(part);
    }, speed);
};

$(document).ready(function () {
    wordflick();
});





document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const sliderItems = Array.from(document.querySelectorAll('.slider-item'));
    const itemWidth = sliderItems[0].offsetWidth; // Largura de um item
    let currentPosition = 0;

    // Clona os primeiros e últimos itens para criar o efeito infinito
    const cloneFirst = sliderItems.slice(0, 4).map(item => item.cloneNode(true));
    const cloneLast = sliderItems.slice(-4).map(item => item.cloneNode(true));

    // Adiciona os clones no início e no fim do track
    cloneFirst.forEach(item => sliderTrack.appendChild(item));
    cloneLast.forEach(item => sliderTrack.insertBefore(item, sliderTrack.firstChild));

    // Define a posição inicial para simular o slider original
    currentPosition = itemWidth * 4; // Pula os clones iniciais
    sliderTrack.style.transform = `translateX(${-currentPosition}px)`;

    // Atualiza a posição do slider
    const updateSliderPosition = () => {
        sliderTrack.style.transition = 'transform 0.5s ease';
        sliderTrack.style.transform = `translateX(${-currentPosition}px)`;
    };

    // Verifica se precisa "resetar" o slider para criar o efeito infinito
    const checkInfiniteScroll = () => {
        if (currentPosition <= 0) {
            currentPosition = itemWidth * sliderItems.length; // Reseta para o final
            sliderTrack.style.transition = 'none'; // Remove a transição para evitar flicker
            sliderTrack.style.transform = `translateX(${-currentPosition}px)`;
        } else if (currentPosition >= itemWidth * (sliderItems.length + 4)) {
            currentPosition = itemWidth * 4; // Reseta para o início
            sliderTrack.style.transition = 'none';
            sliderTrack.style.transform = `translateX(${-currentPosition}px)`;
        }
    };

    // Movimento para a esquerda
    prevBtn.addEventListener('click', () => {
        currentPosition -= itemWidth;
        updateSliderPosition();
        setTimeout(checkInfiniteScroll, 500); // Aguarda a transição antes de verificar
    });

    // Movimento para a direita
    nextBtn.addEventListener('click', () => {
        currentPosition += itemWidth;
        updateSliderPosition();
        setTimeout(checkInfiniteScroll, 500); // Aguarda a transição antes de verificar
    });
});

function loadMoreInstagramPhotos() {
    window.open('https://www.instagram.com/marcelotripa/', '_blank');
}













document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".data-number, .years-number");
    const speed = 50; // Velocidade da contagem
  
    const startCounting = (counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;
        const increment = Math.ceil(target / speed);
  
        if (count < target) {
          counter.innerText = count + increment;
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target;
        }
      };
  
      updateCount();
    };
  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Inicia a contagem apenas se a seção estiver visível
            const counter = entry.target;
            startCounting(counter);
            observer.unobserve(counter); // Para observar novamente
          }
        });
      },
      { threshold: 0.2 } // Quando 20% da seção estiver visível
    );
  
    // Observa cada contador
    counters.forEach((counter) => {
      observer.observe(counter);
    });
  });
  

  
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  
  // Alterna a classe 'active' para abrir/fechar o menu
  function toggleMenu() {
      menu.classList.toggle('active');
  }
  
  // Adiciona evento de clique ao ícone do menu hambúrguer
  hamburger.addEventListener('click', (e) => {
      e.stopPropagation(); // Impede o clique de ser detectado pelo evento do documento
      toggleMenu();
  });
  
  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', (e) => {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !hamburger.contains(e.target)) {
          menu.classList.remove('active');
      }
  });
  


  document.addEventListener("DOMContentLoaded", () => {
    const sliderTrack = document.querySelector(".slider-track");
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
  
    // Detecta o início do toque
    sliderTrack.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX; // Posição inicial do toque
      isDragging = true;
      sliderTrack.style.transition = "none"; // Remove a transição enquanto arrasta
    });
  
    // Detecta o movimento do dedo
    sliderTrack.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
  
      const currentX = e.touches[0].clientX; // Posição atual do toque
      const deltaX = currentX - startX; // Diferença entre início e posição atual
      currentTranslate = prevTranslate + deltaX; // Atualiza o deslocamento
      sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
    });
  
    // Detecta o final do toque
    sliderTrack.addEventListener("touchend", () => {
      isDragging = false;
      prevTranslate = currentTranslate; // Salva o deslocamento para o próximo movimento
      sliderTrack.style.transition = "transform 0.3s ease"; // Restaura a transição
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let isDragging = false;
    let startX;
    let scrollLeft;
  
    // Configuração para deslizar com o mouse ou toque
    sliderTrack.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - sliderTrack.offsetLeft;
      scrollLeft = sliderTrack.scrollLeft;
      sliderTrack.classList.add('dragging');
    });
  
    sliderTrack.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - sliderTrack.offsetLeft;
      scrollLeft = sliderTrack.scrollLeft;
      sliderTrack.classList.add('dragging');
    });
  
    sliderTrack.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - sliderTrack.offsetLeft;
      const walk = (x - startX) * 1; // Velocidade de deslocamento
      sliderTrack.scrollLeft = scrollLeft - walk;
    });
  
    sliderTrack.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - sliderTrack.offsetLeft;
      const walk = (x - startX) * 1; // Velocidade de deslocamento
      sliderTrack.scrollLeft = scrollLeft - walk;
    });
  
    sliderTrack.addEventListener('mouseleave', () => {
      isDragging = false;
      sliderTrack.classList.remove('dragging');
    });
  
    sliderTrack.addEventListener('mouseup', () => {
      isDragging = false;
      sliderTrack.classList.remove('dragging');
    });
  
    sliderTrack.addEventListener('touchend', () => {
      isDragging = false;
      sliderTrack.classList.remove('dragging');
    });
  
    // Navegação com os botões
    prevBtn.addEventListener('click', () => {
      sliderTrack.scrollBy({
        left: -200, // Ajuste a largura para mover por logo
        behavior: 'smooth',
      });
    });
  
    nextBtn.addEventListener('click', () => {
      sliderTrack.scrollBy({
        left: 200, // Ajuste a largura para mover por logo
        behavior: 'smooth',
      });
    });
  });
  
  

  document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.carousel-image').forEach(img => {
        const mobileSrc = img.getAttribute('data-src-mobile');
        if (mobileSrc) {
          img.setAttribute('src', mobileSrc);
        }
      });
    }
  });
  

//   test 

(function($) {
    $.fn.timeline = function() {
      var selectors = {
        id: $(this),
        item: $(this).find(".timeline-item"),
        activeClass: "timeline-item--active",
        img: ".timeline__img"
      };
      selectors.item.eq(0).addClass(selectors.activeClass);
      selectors.id.css(
        "background-image",
        "url(" +
          selectors.item
            .first()
            .find(selectors.img)
            .attr("src") +
          ")"
      );
      var itemLength = selectors.item.length;
      $(window).scroll(function() {
        var max, min;
        var pos = $(this).scrollTop();
        selectors.item.each(function(i) {
          min = $(this).offset().top;
          max = $(this).height() + $(this).offset().top;
          var that = $(this);
          if (i == itemLength - 2 && pos > min + $(this).height() / 2) {
            selectors.item.removeClass(selectors.activeClass);
            selectors.id.css(
              "background-image",
              "url(" +
                selectors.item
                  .last()
                  .find(selectors.img)
                  .attr("src") +
                ")"
            );
            selectors.item.last().addClass(selectors.activeClass);
          } else if (pos <= max - 40 && pos >= min) {
            selectors.id.css(
              "background-image",
              "url(" +
                $(this)
                  .find(selectors.img)
                  .attr("src") +
                ")"
            );
            selectors.item.removeClass(selectors.activeClass);
            $(this).addClass(selectors.activeClass);
          }
        });
      });
    };
  })(jQuery);
  
  $("#timeline-1").timeline();
  