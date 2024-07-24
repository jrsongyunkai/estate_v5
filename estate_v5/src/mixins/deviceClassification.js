export default {
  data() {
    return {
      deviceClass: [
        { name: this.$t('intelligentAirSwitch'), types: [1], tabName: 'first' },
        { name: this.$t('electricalFire'), types: [2, 3], tabName: 'second' },
        { name: this.$t('smartPanel'), types: [19], tabName: 'nineth' },
        { name: this.$t('manualAlarm'), types: [38], tabName: 'twelve', value: 14 },
        { name: this.$t('intelligentModule'), types: [40], tabName: 'thirteen', value: 15 },
        { name: this.$t('powerModule'), types: [43], tabName: 'fourteen', value: 16 },
        { name: this.$t('industrialGas'), types: [26], tabName: 'tenth', value: 11 },
        { name: this.$t('userTransmissionDdevice'), types: [27], tabName: 'eleventh', value: 12 },
        { name: this.$t('waterImmersionWaterLevelAndPressureFlowMeter'), types: [4, 5, 18, 23, 24, 31, 32], tabName: 'third', value: 3 },
        { name: this.$t('smokeAndCombustibleGases'), types: [6, 7, 10, 13, 25, 29, 39, 41, 42, 45], tabName: 'fourth', value: 4 },
        { name: this.$t('temperatureHumidityLightingInfraredRemoteControl'), types: [11, 14, 21, 22], tabName: 'six', value: 6 },
        { name: this.$t('smartMeter'), types: [12], tabName: 'seventh', value: 7 },
        { name: this.$t('intelligentWaterMeter'), types: [15, 16, 28, 30], tabName: 'eighth', value: 8 },
        { name: this.$t('camera'), types: [20], tabName: 'ten', value: 10 },
        { name: this.$t('LORAPrivateNetwork'), types: [8], tabName: 'fifth', value: 5 },
        { name: this.$t('airDisinfector'), types: [33], tabName: 'eleven', value: 13 },
        { name: this.$t('groundingResistance'), types: [44], tabName: 'seventeen', value: 17 },
      ],
    }
  },
}
