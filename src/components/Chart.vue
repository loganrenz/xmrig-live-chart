<template>
  <div id="chart-container">
    <div id="wrapper">
      <div id="chart-line2">
        <apexchart type="line" height="500" :options="chartOptions" :series="myData"></apexchart>
      </div>
      <div id="chart-line">
        <apexchart type="area" height="130" :options="chartOptionsLine" :series="myData"></apexchart>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Chart',
  props: {
    myData: Array,
    timestamps: Array,
    hashRates: Array
  },
  data: () => ({
    series2: [{
      data: []
    }],
    chartOptions: {
      chart: {
        id: 'chart2',
        type: 'line',
        height: 500,
        toolbar: {
          autoSelected: 'pan',
          show: false
        }
      },
      colors: ['#546E7A'],
      stroke: {
        width: 3
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 1,
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime'
      }
    },

    seriesLine: [{
      data: []
    }],
    chartOptionsLine: {
      chart: {
        id: 'chart1',
        height: 200,
        type: 'area',
        brush: {
          target: 'chart2',
          enabled: true
        },
        selection: {
          enabled: true,
        }
      },
      colors: ['#008FFB'],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.91,
          opacityTo: 0.1,
        }
      },
      xaxis: {
        type: 'datetime',
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        tickAmount: 2
      }
    }
  })
}
</script>

