import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { s } from 'react-native-wind';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';

interface IProps {
	title: string;
	showUpdateAccModal: () => void;
	showDeleteAccModal: () => void;
	showDeletePhotoModal: () => void;
	showLogOutModal: () => void;
	imageUrl: string | undefined;
	navigateToAnalyzes: () => void;
}

const AccountWidgetsPanel = ({ title, showUpdateAccModal, showDeleteAccModal, showDeletePhotoModal, showLogOutModal, imageUrl, navigateToAnalyzes }: IProps) => {
	return (
		<View style={s`my-3 px-3 justify-between`}>
			<Animated.Text 
				style={s`text-2xl font-semibold text-black mb-1`}
				entering={FadeInLeft.delay(300).duration(1000)}
			>
				{title}
			</Animated.Text>
			<Animated.View 
				style={s`flex-row`}
				entering={FadeInRight.delay(300).duration(1000)}
			>
				<TouchableOpacity 
					onPress={showDeleteAccModal}
					style={[s`w-10 h-10 items-center justify-center rounded-full mr-3`, {backgroundColor: '#294CB4'}]}
					activeOpacity={.7}
				>
					<FontAwesome5 name='user-minus' size={18} color='#fff' />
				</TouchableOpacity>
				{!imageUrl?.includes('no-image') &&
					<TouchableOpacity 
						onPress={showDeletePhotoModal}
						style={[s`w-10 h-10 items-center justify-center rounded-full mr-3`, {backgroundColor: '#294CB4'}]}
						activeOpacity={.7}
						disabled={imageUrl?.includes('no-image') ? true : false}
					>
						<MaterialCommunityIcons name='file-image-remove' size={23} color='#fff' />
					</TouchableOpacity>}
				<TouchableOpacity 
					onPress={showUpdateAccModal}
					style={[s`w-10 h-10 items-center justify-center rounded-full mr-3`, {backgroundColor: '#294CB4'}]}
					activeOpacity={.7}
				>
					<FontAwesome5 name='user-edit' size={18} color='#fff' />
				</TouchableOpacity>
				<TouchableOpacity 
					onPress={showLogOutModal}
					style={[s`w-10 h-10 items-center justify-center rounded-full mr-3`, {backgroundColor: '#294CB4'}]}
					activeOpacity={.7}
				>
					<Ionicons name='exit' size={25} color='#fff' />
				</TouchableOpacity>
				<TouchableOpacity 
					onPress={navigateToAnalyzes}
					style={[s`w-10 h-10 items-center justify-center rounded-full`, {backgroundColor: '#294CB4'}]}
					activeOpacity={.7}
				>
					<SimpleLineIcons name='chemistry' size={25} color='#fff' />
				</TouchableOpacity>
			</Animated.View>
		</View>
	)
}

export default AccountWidgetsPanel;