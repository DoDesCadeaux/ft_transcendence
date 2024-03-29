const color = ["#f78a50", "#ccc", "#61529e"];
const Name = {
  ORANGE : 0,
  WHITE : 1,
  PURPLE : 2
}

const databuts = [
  { name: 'Pauline', data: [10, 15] },
  // { name: 'Dorian', data: [18, 12] },
  // { name: 'Truc', data: [1, 20] }
];

const optionsColumnChart = {
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    },
    stacked: true // Empiler les barres
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 15
    }
  },
  series: [],
  colors: [color[Name.ORANGE], color[Name.PURPLE]],
  title: {
    text: 'Statistiques des buts',
    align: 'center',
    style: {
      color: color[Name.WHITE],
    }
  },
  xaxis: {
    categories: ['Marqués', 'Encaissés'], // Catégories pour l'axe des abscisses
    labels: {
      style: {
        colors: color[Name.WHITE], // Couleur des légendes de l'axe des abscisses
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: color[Name.WHITE], // Couleur des légendes de l'axe des ordonnées
      }
    }
  },
  legend: {
    labels: {
      colors: color[Name.WHITE] // Couleur des noms dans les légendes
    }
  }
};

var optionsRadialBar = {
  chart: {
    height: 280,
    type: "radialBar",
  },
  title: {
    text: '',
    align: 'center',
    style: {
      color: color[Name.WHITE],
    }
  },
  series: [],
  colors: [color[Name.ORANGE], color[Name.PURPLE]],
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 0,
        size: "60%",
        background: "transparent"
      },
      track: {
        dropShadow: {
          enabled: true,
          top: 2,
          left: 0,
          blur: 4,
          opacity: 0.15
        },
        strokeWidth: '50%'
      },
      dataLabels: {
        name: {
          offsetY: -10,
          color: color[Name.WHITE],
          fontSize: "15px"
        },
        value: {
          color: color[Name.ORANGE],
          fontSize: "30px",
          offsetY: 10,
          show: true,
          formatter: function(val) {
            return parseInt(val) + "%"; // Convertir en entier
          }
        }
      }
    }
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      gradientToColors: [color[Name.PURPLE]],
      stops: [0, 100]
    }
  },
  stroke: {
    lineCap: "round"
  },
  labels: []
};

const dataDuration = [
  { name: 'Pauline', data: [3, 5, 3] },
  // { name: 'Dorian', data: [2, 3, 4] },
  // { name: 'Truc', data: [1, 2, 5] }
];
var optionsBarChart = {
  chart: {
    type: 'bar',
    height: 280,
    width: 650,
    toolbar: {
      show: false
    },
    stacked: true
  },
  title: {
    text: 'Durée moyenne des matchs (en min)',
    align: 'center',
    style: {
      color: color[Name.WHITE],
    }
  },
  colors: [color[Name.ORANGE], color[Name.PURPLE]],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 15
    }
  },
  series: [],
  xaxis: {
    categories: ['Tous matchs confondus', 'Matchs 1 VS 1', 'Matchs de tournois'],
    labels: {
      style: {
        colors: color[Name.WHITE], // Couleur des légendes de l'axe des ordonnées
      }
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: color[Name.WHITE], // Couleur des légendes de l'axe des ordonnées
      }
    }
  },
  legend: {
    labels: {
      colors: color[Name.WHITE] // Couleur des noms dans les légendes
    }
  },

}