import React from 'react';
import { View, ScrollView } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { s } from "react-native-wind";
import { HeaderLogo, MenuList } from '../../components';

interface IProps {
	navigation: NavigationProp<ParamListBase>;
}

const Home = ({ navigation }: IProps) => {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={s`pb-3`}
		>
			<HeaderLogo 
				logo={require('../../assets/images/vstrecha-logo.png')} 
			/>
			<MenuList
				navigation={navigation}
			/>
		</ScrollView>
	)
}

export default Home;