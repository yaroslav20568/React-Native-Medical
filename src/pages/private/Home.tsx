import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { s } from "react-native-wind";
import { HeaderLogo, MenuList } from '../../components';

interface IProps {
	navigation: NavigationProp<ParamListBase>;
}

const Home = ({ navigation }: IProps) => {
	return (
		<View>
			<ScrollView
				showsVerticalScrollIndicator={false}
			>
				<HeaderLogo 
					logo={require('../../assets/images/vstrecha-logo.png')} 
				/>

				<View style={s`px-3`}>
					<MenuList
						navigation={navigation}
					/>
				</View>
			</ScrollView>
		</View>
	)
}

export default Home;