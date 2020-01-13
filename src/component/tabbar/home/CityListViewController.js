import {
	SectionList, Text, View,
	TouchableOpacity, Image,
	FlatList
} from 'react-native';
import {Colors} from '../../utils/Styles';
import React, {Component} from 'react';
import {ShareTool} from '../../utils/ShareTool';
import {Navigation} from 'react-native-navigation';

export default class CityListViewController extends Component {
	static options(passProps) {
		return {
			topBar: {
				rightButtons: [
					{
						id: 'deselect',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						text: 'Deselect'
					},
				],
			}
		};
	}

	constructor(props) {
		super(props);
		this.state = {
			dataSource: [
				"ANNISTON",
				"ASHVILLE",
				"ALEX CITY",
				"ARDMORE",
				"ASHLAND",
				"ALEXANDER CITY",
				"ANDALUSIA",
				"ALBERTVILLE",
				"ALEXANDRIA",
				"ADDISON",
				"ATMORE",
				"ATHENS",
				"AUTAUGAVILLE",
				"ABBEVILLE",
				"ARAB",
				"ANCHORAGE",
				"AUBURN UNIVERSITY",
				"ADAMSVILLE",
				"AUBURN",
				"ATTALLA",
				"ALICEVILLE",
				"ALLENTOWN",
				"ALABASTER",
				"BOAZ",
				"BRIDGEPORT",
				"BRENT",
				"BURKVILLE",
				"BREWTON",
				"B HAM",
				"BRYANT",
				"BIRMINGHAM",
				"BRUNDIDGE",
				"BROWNSBORO",
				"B'HAM",
				"BIRIMINGHAM",
				"BRIMINGHAM",
				"BAYOU LA BATRE",
				"BESSEMER",
				"BLOUNTSVILLE",
				"BAILEYTON",
				"BAY MINETTE",
				"BUTLER",
				"BROOKLYN",
				"BHAM",
				"COLLINSVILLE",
				"CARROLLTON",
				"CLAYTON",
				"CENTRE",
				"COLUMBIANA",
				"COOSADA",
				"CULLMAN",
				"CARBON HILL",
				"COURTLAND",
				"CENTREVILLE",
				"CAMDEN",
				"CHATOM",
				"CHICKASAW",
				"CHILDERSBURG",
				"CROPWELL",
				"CITRONELLE",
				"CORDOVA",
				"CLEVELAND",
				"CHELSEA",
				"CEDAR BLUFF",
				"CASTLEBERRY",
				"CAMP HILL",
				"CENTER POINT",
				"CROSSVILLE",
				"CALERA",
				"CLANTON",
				"DOTHAN",
				"DAUPHIN ISLAND",
				"DOUBLE SPRINGS",
				"DELTA",
				"DANVILLE",
				"DEMOPOLIS",
				"DAPHNE",
				"DECATUR",
				"DORA",
				"DADEVILLE",
				"DALEVILLE",
				"EAST BREWTON",
				"ENSLEY",
				"ELKMONT",
				"EUTAW",
				"ECLECTIC",
				"ELBA",
				"ELBERTA",
				"ENTERPRISE",
				"EUFAULA",
				"EVA",
				"EVERGREEN",
				"FAIRFIELD",
				"FAIRHOP",
				"FULTONDALE",
				"FT MCCLELLAN",
				"FT RUCKER",
				"FLORALA",
				"FT PAYNE",
				"FLOMATON",
				"FAYETTE",
				"FYFFE",
				"FORT RUCKER",
				"FAIRHOPE",
				"FORESTDALE",
				"FOLEY",
				"FORT PAYNE",
				"FLORENCE",
				"FT. RUCKER",
				"GULF SHORES",
				"GUIN",
				"GURLEY",
				"GUNTERSVILLE",
				"GRAYSVILLE",
				"GARDENDALE",
				"GROVE HILL",
				"GADSDEN",
				"GORDO",
				"GEORGIANA",
				"GRANT",
				"GADSEN",
				"GENEVA",
				"GILBERTOWN",
				"GERALDINE",
				"GRAND BAY",
				"GLENCOE",
				"GREENSBORO",
				"GREENVILLE",
				"HAMPTON COVE",
				"HELENA",
				"HARTSELLE",
				"HARTFORD",
				"HAYDEN",
				"HOLLY POND",
				"HARPERSVILLE",
				"HANCEVILLE",
				"HUEYTOWN",
				"HUNTSVILLE",
				"HOBSON CITY",
				"HENAGAR",
				"HOOVER",
				"HOKES BLUFF",
				"HAMILTON",
				"HACKLEBURG",
				"HEFLIN",
				"HARVEST",
				"HAYNEVILLE",
				"HOMEWOOD",
				"HAZEL GREEN",
				"HALEYVILLE",
				"HEADLAND",
				"IRVINGTON",
				"IRONDALE",
				"JACKSON",
				"JACKSONVILLE",
				"JASPER",
				"JEMISON",
				"KIMBERLY",
				"KILLEN",
				"LUVERNE",
				"LINDEN",
				"LAFAYETTE",
				"LANETT",
				"LEESBURG",
				"LOXLEY",
				"LILLIAN",
				"LEXINGTON",
				"LIVINGSTON",
				"LEEDS",
				"LINCOLN",
				"LINEVILLE",
				"MONTGOMERY",
				"MATHEWS",
				"MAGNOLIA SPRINGS",
				"MONTROSE",
				"MCCALLA",
				"MARION",
				"MILLRY",
				"MOUNTAIN BROOK",
				"MOUNTAIN BRK",
				"MAYLENE",
				"MOBILE",
				"MADISON",
				"MONTOMERY",
				"MOULTON",
				"MUSCLE SHOALS",
				"MIDLAND CITY",
				"MUNFORD",
				"MERIDIANVILLE",
				"MAXWELL AFB",
				"MOUNT VERNON",
				"MAXWELL, AFB",
				"MONROEVILLE",
				"MORRIS",
				"MT VERNON",
				"MONTEVALLO",
				"MILLPORT",
				"MC CALLA",
				"MIDFIELD",
				"MAPLESVILLE",
				"MILLBROOK",
				"MCINTOSH",
				"MOODY",
				"NEWTON",
				"NOTASULGA",
				"NORTHPORT",
				"NEW MARKET",
				"ONEONTA",
				"OWENS CROSS ROADS",
				"OPELIKA",
				"OZARK",
				"OPP",
				"OHATCHEE",
				"ORANGE BEACH",
				"OXFORD",
				"OWENS CROSSROADS",
				"PARRISH",
				"PLEASANT CITY",
				"PIKE ROAD",
				"PIEDMONT",
				"PINSON",
				"PRATTVILLE",
				"PINEAPPLE",
				"PRICHARD",
				"PHENIX CITY",
				"PELL CITY",
				"PELHAM",
				"PINE APPLE",
				"RAINSVILLE",
				"RAMER",
				"RED LEVEL",
				"ROBERTSDALE",
				"RUSSELLVILLE",
				"ROGERSVILLE",
				"ROBERSTDALE",
				"RED BAY",
				"REFORM",
				"REDSTONE ARSENAL",
				"RAINBOW CITY",
				"ROANOKE",
				"SEMMES",
				"SYLACAUGA",
				"SEALE",
				"STEVENSON",
				"SULLIGENT",
				"SPANISH FORT",
				"SAMSON",
				"SCOTTSBORO",
				"STERRETT",
				"SUMITON",
				"SYLACOUGA",
				"SAWYERVILLE",
				"SPRINGVILLE",
				"SHOAL CREEK",
				"SALEM",
				"SARDIS CITY",
				"SUMMERDALE",
				"SECTION",
				"SOUTHSIDE",
				"SMITHS",
				"SELMA",
				"SILVERHILL",
				"SHEFFIELD",
				"SARALAND",
				"SLOCOMB",
				"TROY",
				"TUSCALOUSA",
				"TONEY",
				"TOXEY",
				"TARRANT",
				"TUSKEGEE",
				"THOMASVILLE",
				"TRUSSVILLE",
				"TUSCUMBIA",
				"TUSACLOOSA",
				"TALLADEGA",
				"TUSCALOOSA",
				"TOWN CREEK",
				"TALLASSEE",
				"URIAH",
				"UNION SPRINGS",
				"UNIONTOWN",
				"VESTAVIA HILLS",
				"VINEMONT",
				"VESTAVIA HLS",
				"VERNON",
				"VALLEY",
				"VESTAVIA",
				"VANCE",
				"WEST BLOCTON",
				"WINFIELD",
				"WEDOWEE",
				"WALNUT GROVE",
				"WARRIOR",
				"WILMER",
				"WOODSTOCK",
				"WOODLAND",
				"WADLEY",
				"WETUMPKA",
				"YORK",
			],
			selectedCity: props.selectedCity
		}

	}

	componentDidMount() {
		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	componentWillUnmount() {
		// Not mandatory
		if (this.navigationEventListener) {
			this.navigationEventListener.remove();
		}
	}

	navigationButtonPressed({ buttonId }) {
		if (buttonId === 'deselect') {
			this.props.didSelectedCity && this.props.didSelectedCity('')
			Navigation.pop(this.props.componentId);
		}
	}

	renderLineView() {
		return(
			<View style={{position: 'absolute', height: 1.0, left: 8, right: 0, bottom: 0, backgroundColor: Colors.lineColor}}/>
		)
	}

	renderRightArrowImage() {
		return(
			<Image source={require('../../../resource/image/base/checkmark.png')} style={{width: 16, height: 12, marginLeft: 8}}/>
		)
	}

	renderItem(item) {
		let isSelected = (item === this.state.selectedCity)
		return(
			<TouchableOpacity onPress={() => {
				this.props.didSelectedCity && this.props.didSelectedCity(item)
				Navigation.dismissModal(this.props.componentId);
			}} style={{width: '100%', paddingHorizontal: 16, height: 50,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
			}}>
				<Text style={{fontSize: 16, color: isSelected ? Colors.theme : Colors.black,}}>{item}</Text>
				{isSelected ? this.renderRightArrowImage() : null}
				{this.renderLineView()}
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: Colors.white}}>
				<FlatList
					renderItem={({item}) => this.renderItem(item)}
					data={this.state.dataSource}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
				/>
			</View>
		)
	}
}
