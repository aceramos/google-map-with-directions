
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coords: [],
      region: {
        latitude: 14.5776043,
        longitude: 121.0486219,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015
      },
      findLoc: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015
      }
    }
  }
 
  onRegionChange(region) {
    this.setState({ region });
  }

  findPath() {
   this.getDirections("14.5776043,121.0486219", ''+this.state.region.latitude +','+ this.state.region.longitude)
  }

  async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            this.setState({coords: coords})
            return coords
        } catch(error) {
            alert(error)
            return error
        }
    }

  render() {
    return (
      <View style={styles.container}>
        <MapView 
          style={styles.map} 
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}>

        <MapView.Polyline 
            coordinates={this.state.coords}
            strokeWidth={2}
            strokeColor="green"/>

        </MapView>

        <View style={styles.latLngView}>
          <Text style={styles.title}>lat: {Number(this.state.region.latitude).toFixed(7)}, lng: {Number(this.state.region.longitude).toFixed(7)}</Text>
        </View>


        <View style={styles.viewStyle}>
          <Text style={styles.title}>Find Path</Text>
          <View style={styles.inputSection}>
            <TextInput
              placeholder="latitude"
              style={styles.input}
            />

            <TextInput
              placeholder="longitude"
              style={styles.input}
            />
          </View>
          <View stlye={styles.buttonContainer}>
              <TouchableOpacity style={styles.findPathButton} onPress={()=> this.findPath()}>
                <Text style={styles.buttonTextStyle}>Find Path</Text>
              </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF', 
    padding: 15
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  viewStyle: {
    backgroundColor: '#FFF',
    width: '90%',
    alignSelf: 'center',
    padding: 10
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingBottom: 5
  },
  inputSection: {
    flexDirection: 'row'
  },
  latLngView: {
    backgroundColor: 'rgba(245, 252, 255, 0.8)',
    width: '90%',
    borderRadius: 50,
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center'
  },
  input:{
    flex: 1,
    textAlign: 'center'
  },
  buttonContainer: { 
    alignItems: 'center',
    justifyContent: 'center',
  },
  findPathButton: {
    alignSelf:'center',
    width: '90%',
    backgroundColor: '#5fba7d',
    borderRadius: 25,
    alignItems: 'center',
    padding: 5
  },
  buttonTextStyle: {
    color: '#FFF'
  }

});