
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';


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
      markers: {
        rider: {
          latlng: {
            latitude: 14.5776043,
            longitude: 121.0486219,
            latitudeDelta: 0.0015,
            longitudeDelta: 0.0015
          },
          pinImage: require('./src/assets/images/rider.png'),
          riderImage: require('./src/assets/images/rider1.jpg'),
          riderName: 'Rider One',
          riderStore: 'Jollibucks'
        },
        destination: {
          latlang: {
            latitude: 14.5776043,
            longitude: 121.0486219
          },
          pinImage: require('./src/assets/images/building.png'),
          destinationImage:  require('./src/assets/images/comfac.jpg'),
          destinationName: 'Comfac Technology Center',
          destinationDescription: 'Comfac Technology Center'
        }
      },
      showTraffic: false,
      showRoute: true
    }
  }
 
  onRegionChange(region) {
    if(this.state.showRoute) {
      this.setState({ region });
      this.getDirections(''+this.state.region.latitude+','+this.state.region.longitude, '14.5776043,121.0486219')
    } else {
      this.setState({ region });
    }
  }

  findPath() {
   this.getDirections(''+this.state.region.latitude+','+this.state.region.longitude, '14.5776043,121.0486219')
  }
 
  toggleShowTraffic() {
    this.setState({showTraffic: !this.state.showTraffic})
  }

  toggleShowRoute() {
    this.setState({showRoute: !this.state.showRoute})
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
            ToastAndroid.showWithGravityAndOffset('Updating route..', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
            return error
        }
    }

  render() {
    return (
      <View style={styles.container}>
        <MapView 
          style={styles.map} 
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)} 
          showsTraffic={this.state.showTraffic}
          >

          {/* RIDER MARKER */}
           <MapView.Marker
            coordinate={this.state.region}
            title={this.state.markers.rider.riderName}
            description={this.state.markers.rider.riderStore}
       
            >
            <View>
              <Image 
                style={styles.pinImage}
                source={this.state.markers.rider.pinImage}/>
            </View>

            <MapView.Callout>
              <View style={styles.callout}>
                <Image style={styles.calloutPhoto} source={this.state.markers.rider.riderImage} />
                <Text style={styles.calloutTitle}>{this.state.markers.rider.riderName}</Text>
                <Text style={styles.calloutDescription}>{this.state.markers.rider.riderStore}</Text>
              </View>
            </MapView.Callout>
            </MapView.Marker>

            {/* DESTINATION MARKER */}

            <MapView.Marker
            coordinate={this.state.markers.destination.latlang}
            title={this.state.markers.destination.destinationName}
            description={this.state.markers.destination.destinationDescription}
            >
              <View>
                <Image 
                  style={styles.pinImage}
                  source={this.state.markers.destination.pinImage}/>
                <Text></Text>
              </View>
            </MapView.Marker>

          {/* ROUTE */}

          <MapView.Polyline 
            coordinates={this.state.coords}
            strokeWidth={8}
            strokeColor={(this.state.showRoute) ? 'green' : 'transparent'}/>

        </MapView>

        
        <View>
            <View style={styles.floatingButtonsSection}>
              <TouchableOpacity style={styles.floatingButton} onPress={this.toggleShowTraffic.bind(this)}> 
                <MaterialIcons name='traffic' size={25} style={(this.state.showTraffic) ? styles.floatingButtonIconActive : styles.floatingButtonIcon}/>
              </TouchableOpacity>


              <TouchableOpacity style={styles.floatingButton} onPress={this.toggleShowRoute.bind(this)}>
                <FontAwesomeIcons name='road' size={25} style={(this.state.showRoute) ? styles.floatingButtonIconActive : styles.floatingButtonIcon} />
              </TouchableOpacity> 
            </View>
            <View style={styles.addressSection}>
                <View>
                  <Text style={styles.addressHeader}>ADDRESS</Text>
                  <Text style={styles.addressInfo}>
                    <MaterialIcons name='room'/> 2/F Comfac Technology Center, 536 Calbayog St. Brgy Highway Hills, Mandaluyong City, Philippines 1550</Text>
                </View>
                
                {/* <View style={styles.findPathButtonContainer}>
                  <TouchableOpacity style={styles.findPathButton} onPress={()=> this.findPath()}>
                    <Text style={styles.buttonTextStyle}>Find Route</Text>
                  </TouchableOpacity>
                </View> */}
            </View>
          </View>
         
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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
  },
  pinImage: {
    height: 36,
    width:36
  },
  callout: {
    flex: 1
  },
  calloutPhoto: {
    flex: 1,
    width: 100,
    height: 50
  },
  calloutTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  calloutDescription: {
    textAlign: 'center'
  },
  addressSection: {
    marginTop: 10,
    backgroundColor: '#FFF',
    width: '98%',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'column',
    elevation: 1
  },
  addressHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6BC911',
    paddingBottom: 5
  },
  addressInfo: {
    color: '#353535',
    fontSize: 12,
  },
  findPathButtonContainer: {
    marginTop: 10
  },
  floatingButtonsSection: {
    alignSelf:'flex-end',
    flexDirection: 'column'
  },
  floatingButton: {
    padding: 2,
    paddingLeft: 6,
    paddingRight: 6,
    backgroundColor: '#FFF',
    elevation: 1,
    borderRadius: 3,
    marginTop: 5
  },
  floatingButtonIcon: {
    color: 'gray'
  },
  floatingButtonIconActive: {
    color: '#6BC911'
  }
});