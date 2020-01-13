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
				"ABBEVILLE",
				"ADAMSVILLE",
				"ADDISON",
				"ALABASTER",
				"ALBERTVILLE",
				"ALEX CITY",
				"ALEXANDER CITY",
				"ALEXANDRIA",
				"ALICEVILLE",
				"ALLENTOWN",
				"ANCHORAGE",
				"ANDALUSIA",
				"ANNISTON",
				"ARAB",
				"ARDMORE",
				"ASHLAND",
				"ASHVILLE",
				"ATHENS",
				"ATMORE",
				"ATTALLA",
				"AUBURN",
				"AUBURN UNIVERSITY",
				"AUTAUGAVILLE",
				"B HAM",
				"B'HAM",
				"BAILEYTON",
				"BAY MINETTE",
				"BAYOU LA BATRE",
				"BESSEMER",
				"BHAM",
				"BIRIMINGHAM",
				"BIRMINGAM",
				"BIRMINGHAM",
				"BLOUNTSVILLE",
				"BOAZ",
				"BRENT",
				"BREWTON",
				"BRIDGEPORT",
				"BRIMINGHAM",
				"BROOKLYN",
				"BROWNSBORO",
				"BRUNDIDGE",
				"BRYANT",
				"BURKVILLE",
				"BUTLER",
				"CALERA",
				"CAMDEN",
				"CAMP HILL",
				"CARBON HILL",
				"CARROLLTON",
				"CASTLEBERRY",
				"CEDAR BLUFF",
				"CENTER POINT",
				"CENTRE",
				"CENTREVILLE",
				"CHATOM",
				"CHELSEA",
				"CHICKASAW",
				"CHILDERSBURG",
				"CITRONELLE",
				"CLANTON",
				"CLAYTON",
				"CLEVELAND",
				"COLLINSVILLE",
				"COLUMBIANA",
				"COOSADA",
				"CORDOVA",
				"COURTLAND",
				"CROPWELL",
				"CROSSVILLE",
				"CULLMAN",
				"DADEVILLE",
				"DALEVILLE",
				"DANVILLE",
				"DAPHNE",
				"DAUPHIN ISLAND",
				"DECATUR",
				"DELTA",
				"DEMOPOLIS",
				"DORA",
				"DOTHAN",
				"DOUBLE SPRINGS",
				"EAST BREWTON",
				"ECLECTIC",
				"ELBA",
				"ELBERTA",
				"ELKMONT",
				"ENSLEY",
				"ENTERPRISE",
				"EUFAULA",
				"EUTAW",
				"EVA",
				"EVERGREEN",
				"FAIRFIELD",
				"FAIRHOP",
				"FAIRHOPE",
				"FAYETTE",
				"FLOMATON",
				"FLORALA",
				"FLORENCE",
				"FOLEY",
				"FORESTDALE",
				"FORT PAYNE",
				"FORT RUCKER",
				"FT MCCLELLAN",
				"FT PAYNE",
				"FT RUCKER",
				"FT. RUCKER",
				"FULTONDALE",
				"FYFFE",
				"GADSDEN",
				"GADSEN",
				"GARDENDALE",
				"GENEVA",
				"GEORGIANA",
				"GERALDINE",
				"GILBERTOWN",
				"GLENCOE",
				"GORDO",
				"GRAND BAY",
				"GRANT",
				"GRAYSVILLE",
				"GREENSBORO",
				"GREENVILLE",
				"GROVE HILL",
				"GUIN",
				"GULF SHORES",
				"GUNTERSVILLE",
				"GURLEY",
				"HACKLEBURG",
				"HALEYVILLE",
				"HAMILTON",
				"HAMPTON COVE",
				"HANCEVILLE",
				"HARPERSVILLE",
				"HARTFORD",
				"HARTSELLE",
				"HARVEST",
				"HAYDEN",
				"HAYNEVILLE",
				"HAZEL GREEN",
				"HEADLAND",
				"HEFLIN",
				"HELENA",
				"HENAGAR",
				"HOBSON CITY",
				"HOKES BLUFF",
				"HOLLY POND",
				"HOMEWOOD",
				"HOOVER",
				"HUEYTOWN",
				"HUNTSVILLE",
				"IRONDALE",
				"IRVINGTON",
				"JACKSON",
				"JACKSONVILLE",
				"JASPER",
				"JEMISON",
				"KILLEN",
				"KIMBERLY",
				"LAFAYETTE",
				"LANETT",
				"LEEDS",
				"LEESBURG",
				"LEXINGTON",
				"LILLIAN",
				"LINCOLN",
				"LINDEN",
				"LINEVILLE",
				"LIVINGSTON",
				"LOXLEY",
				"LUVERNE",
				"MADISON",
				"MAGNOLIA SPRINGS",
				"MAPLESVILLE",
				"MARION",
				"MATHEWS",
				"MAXWELL AFB",
				"MAXWELL, AFB",
				"MAYLENE",
				"MC CALLA",
				"MCCALLA",
				"MCINTOSH",
				"MERIDIANVILLE",
				"MIDFIELD",
				"MIDLAND CITY",
				"MILLBROOK",
				"MILLPORT",
				"MILLRY",
				"MOBILE",
				"MONROEVILLE",
				"MONTEVALLO",
				"MONTGOMERY",
				"MONTOMERY",
				"MONTROSE",
				"MOODY",
				"MORRIS",
				"MOULTON",
				"MOUNT VERNON",
				"MOUNTAIN BRK",
				"MOUNTAIN BROOK",
				"MT VERNON",
				"MUNFORD",
				"MUSCLE SHOALS",
				"NEW MARKET",
				"NEWTON",
				"NORTHPORT",
				"NOTASULGA",
				"OHATCHEE",
				"ONEONTA",
				"OPELIKA",
				"OPP",
				"ORANGE BEACH",
				"OWENS CROSS ROADS",
				"OWENS CROSSROADS",
				"OXFORD",
				"OZARK",
				"PARRISH",
				"PELHAM",
				"PELL CITY",
				"PHENIX CITY",
				"PIEDMONT",
				"PIKE ROAD",
				"PINE APPLE",
				"PINEAPPLE",
				"PINSON",
				"PLEASANT CITY",
				"PRATTVILLE",
				"PRICHARD",
				"RAINBOW CITY",
				"RAINSVILLE",
				"RAMER",
				"RED BAY",
				"RED LEVEL",
				"REDSTONE ARSENAL",
				"REFORM",
				"ROANOKE",
				"ROBERSTDALE",
				"ROBERTSDALE",
				"ROGERSVILLE",
				"RUSSELLVILLE",
				"SALEM",
				"SAMSON",
				"SARALAND",
				"SARDIS CITY",
				"SAWYERVILLE",
				"SCOTTSBORO",
				"SEALE",
				"SECTION",
				"SELMA",
				"SEMMES",
				"SHEFFIELD",
				"SHOAL CREEK",
				"SILVERHILL",
				"SLOCOMB",
				"SMITHS",
				"SOUTHSIDE",
				"SPANISH FORT",
				"SPRINGVILLE",
				"STERRETT",
				"STEVENSON",
				"SULLIGENT",
				"SUMITON",
				"SUMMERDALE",
				"SYLACAUGA",
				"SYLACOUGA",
				"TALLADEGA",
				"TALLASSEE",
				"TARRANT",
				"THOMASVILLE",
				"TONEY",
				"TOWN CREEK",
				"TOXEY",
				"TROY",
				"TRUSSVILLE",
				"TUSACLOOSA",
				"TUSCALOOSA",
				"TUSCALOUSA",
				"TUSCUMBIA",
				"TUSKEGEE",
				"UNION SPRINGS",
				"UNIONTOWN",
				"URIAH",
				"VALLEY",
				"VANCE",
				"VERNON",
				"VESTAVIA",
				"VESTAVIA HILLS",
				"VESTAVIA HLS",
				"VINEMONT",
				"WADLEY",
				"WALNUT GROVE",
				"WARRIOR",
				"WEDOWEE",
				"WEST BLOCTON",
				"WETUMPKA",
				"WILMER",
				"WINFIELD",
				"WOODLAND",
				"WOODSTOCK",
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
