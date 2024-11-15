import React, { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { s } from 'react-native-wind';
import { observer } from 'mobx-react-lite';
import { HeaderLogo, GoBack, AnalyzesList, Loader } from '../../components';
import { RootStackParams } from '../../navigation/HomeStacks';
import { userStore } from '../../mobx';

interface IProps extends NativeStackScreenProps<RootStackParams, 'Analyzes'> {}

const Analyzes = observer(({ navigation }: IProps) => {
	useEffect(() => {
		userStore.loadAnalyzes(userStore.userData?.id);
	}, []);

	const loadMoreAnalyzes = useCallback((): void => {
		userStore.loadMoreAnalyzes(userStore.userData?.id);
	}, []);

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={s`pb-3`}
		>
			<HeaderLogo 
				logo={require('../../assets/images/vstrecha-logo.png')} 
			/>
			<GoBack 
				navigation={navigation} 
			/>
			<View style={s`mt-3 px-3`}>
				<Text style={s`text-2xl font-semibold text-black mb-4`}>Ваши анализы: </Text>
				{userStore.isLoading ?
					<Loader /> :
					<AnalyzesList
						analyzes={userStore.analyzes}
						loadMoreAnalyzes={loadMoreAnalyzes}
						isLoadingMore={userStore.isLoadingMore}
					/>
				}
			</View>
		</ScrollView>
	)
})

export default Analyzes;