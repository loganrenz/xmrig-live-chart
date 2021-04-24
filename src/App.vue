<template>
  <div id="app">
    <div>
      <Chart :my-data="series"></Chart>
    </div>
  </div>
</template>

<script>
import Chart from './components/Chart.vue'
import moment from 'moment'

export default {
  name: 'App',
  components: {
    Chart
  },
  data: () => {
    return {
      series: [],
      maxDataPoints: 10000,
      myData: []
    }
  },
  methods: {
    setSeries() {
      console.log(`Setting series`)
      this.series =  [{data: this.myData.slice(-this.maxDataPoints)}]
    }
  },
  created: function () {
    console.log("Conencting websocket 192.168.1.35:3001")
    this.connection = new WebSocket("ws://bonito.local:3001")
  },
  mounted: function () {
    this.connection.onopen = function (event) {
      console.log(event)
      console.log("Successfully connected to the websocket server...")
    }
    let vm = this;
    this.connection.onmessage = function (event) {
      //console.log(`Received a message: ${JSON.stringify(event.data)}`)
      let message;
      try {
        message = JSON.parse(event.data)
      } catch (e) {
        console.log(`Couldn't parse message ${event.data}`)
        return;
      }
      if(Array.isArray(message)){
        console.log(`Mapping mass front loaded data into my data: ${JSON.stringify}`)
        vm.myData = message.map(msg => {
          return {x: moment(msg.timestamp).toDate().getTime(), y: msg.hash_rate}
        })
        console.log(vm.myData);
      }else {
        const timestamp = moment(message.timestamp).toDate().getTime()
        vm.myData.push({x: timestamp, y: message.hash_rate})        
      }
      vm.setSeries()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
