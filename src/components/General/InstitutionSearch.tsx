import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { s } from 'react-native-wind';

interface IProps {
	inputValue: string;
	setInputValue: (value: string) => void;
}

const InstitutionSearch = ({ inputValue, setInputValue }: IProps) => {
	return (
		<View>
			<TextInput
				placeholder='Название учреждения'
				onChangeText={(textValue)=> setInputValue(textValue)}
				value={inputValue}
				style={s`border-2 border-solid border-black-900 text-base px-3 mb-1`}
			/>
		</View>
	)
}

export default InstitutionSearch;