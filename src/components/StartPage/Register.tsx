import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { s } from "react-native-wind";
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { observer } from 'mobx-react-lite';
import { siteUrl } from '../../constants';
import { IRespAuthData, IRespAuthError, ITypeUser } from '../../types';

interface IProps {
	infoText: string;
	setInfoText: (value: string) => void;
	isDisabledBtn: boolean;
	setIsDisabledBtn: (value: boolean) => void;
	setCurrTab: (value: string) => void;
	typesUsers: Array<ITypeUser>;
}

interface IFormValues {
	email: string;
	password: string;
	gender: string;
	typesUsersArr: Array<number>;
	city: string;
	typesUsers?: string;
	file: object | null;
	role: string;
}

interface IImage {
	name: string | undefined;
	type: string | undefined;
	uri: string | undefined;
}

const SignupSchema = Yup.object().shape({
	email: Yup.string().email('Не корректный email')
		.min(2, 'От 2 символов')
		.max(30, 'до 30 символов')
		.required('Заполните обязательно'),
	password: Yup.string()
		.min(6, 'От 6 символов')
		.max(16, 'до 16 символов')
		.required('Заполните обязательно'),
	gender: Yup.string()
		.required('Выберите пункт'),
	typesUsersArr: Yup.array().of(Yup.number())
		.min(1, 'Заполните хотя бы 1 чекбокс')
		.required('Заполните обязательно'),
	city: Yup.string()
		.min(2, 'От 2 символов')
		.max(16, 'до 16 символов')
		.required('Заполните обязательно')
		.matches(/^([a-zа-яё]+)$/i, 'Цифры не должны присутствовать')
});

const Register = observer(({ infoText, setInfoText, isDisabledBtn, setIsDisabledBtn, setCurrTab, typesUsers }: IProps) => {
	const [typesUsersArrArray, setTypesUsersArrArray] = useState<ITypeUser[]>(typesUsers);
	const formValues: IFormValues = {email: '', password: '', gender: '', typesUsersArr: [], city: '', file: null, role: 'User'};
	const [image, setImage] = useState<IImage | null>(null);

	useEffect(() => {
		setInfoText('');
	}, []);

	const chooseImage = async () => {
		const currentImage = await launchImageLibrary({
			mediaType: 'photo'
		});

		setImage({
			name: currentImage.assets[0].fileName,
			type: currentImage.assets[0].type,
			uri: Platform.OS === "android" ? currentImage.assets[0].uri : currentImage.assets[0].uri.replace("file://", "")
		});
	}

	const resetPhoto = () => {
		setImage(null);
	}

	return (
		<>
			<Formik
				initialValues={formValues}
				validationSchema={SignupSchema}
				onSubmit={(values, { resetForm }) => {
					const sortValues = values.typesUsersArr.slice().sort(function (a, b) {return a - b;})
					values = {...values, typesUsersArr: sortValues, file: image};
					const sendObject = {...values, typesUsers: values.typesUsersArr.join(',')} as Partial<IFormValues>;
					delete sendObject.typesUsersArr;
					if(sendObject.file === null) {
						delete sendObject.file;
					}

					setIsDisabledBtn(true);

					const formData = new FormData();

					for (let key in sendObject) {
						formData.append(key, sendObject[key as keyof IFormValues]);
					}

					axios<IRespAuthData>({
						url: `${siteUrl}/api/register`,
						method: 'POST',
						headers: {
							'Accept': 'multipart/form-data',
							'Content-Type': 'multipart/form-data'
						},
						data: formData
					})
					.then((response) => {
						setIsDisabledBtn(false);

						if(response.status === 200) {
							setInfoText('Вы зарегистрированы, залогиньтесь');
							resetForm();
							resetPhoto();
							setTypesUsersArrArray(typesUsers);
							setTimeout(() => {setCurrTab('login');}, 1000);
						}
					})
					.catch(({ response }: IRespAuthError) => {
						setIsDisabledBtn(false);
						setInfoText(response.data.message);
					})
				}}
			>
				{({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
					<View>
						<View style={s`mb-4`}>
							<TextInput
								placeholder='email'
								onChangeText={handleChange('email')}
								onBlur={handleBlur('email')}
								value={values.email}
								style={s`border-2 border-solid ${errors.email && touched.email ? 'border-red-900' : 'border-black-900'} text-base px-3 mb-1`}
							/>
							{errors.email && touched.email ? (
								<Text style={s`text-red-900 text-base`}>{errors.email}</Text>
							) : ''}
						</View>
						<View style={s`mb-2`}>
							<TextInput
								placeholder='пароль'
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
								value={values.password}
								style={s`border-2 border-solid ${errors.password && touched.password ? 'border-red-900' : 'border-black-900'} text-base px-3 mb-1`}
								secureTextEntry={true}
							/>
							{errors.password && touched.password ? (
								<Text style={s`text-red-900 text-base`}>{errors.password}</Text>
							) : ''}
						</View>
						<View style={s`mb-2`}>
							<RNPickerSelect
								placeholder = {{
									label: 'пол',
									value: '',
									color: '#9EA0A4',
								}}
								value={values.gender}
								onValueChange={handleChange('gender')}
								items={[
									{label: 'Мужской', value: 'Мужской'},
									{label: 'Женский', value: 'Женский'}
								]}
							/>
							{errors.gender && touched.gender ? (
								<Text style={s`text-red-900 text-base`}>{errors.gender}</Text>
							) : ''}
						</View>
						<View style={s`mb-5`}>
							<Text style={s`text-base mb-2`}>Тип пользователя:</Text>
							{typesUsersArrArray.map((item, currIndex) => 
								<View style={s`flex-row items-center mb-1`} key={`checkbox_${currIndex}`}>
									<CheckBox
										value={item.isChecked}
										onValueChange={value =>
											setTypesUsersArrArray(typesUsersArrArray.map((item, index) => {
												if(currIndex === index) {
													if(!item.isChecked && !values.typesUsersArr.includes(currIndex)) {
														values.typesUsersArr = [...values.typesUsersArr, currIndex];
													} else {
														const findIndex = values.typesUsersArr.findIndex((item) => currIndex === item);
														values.typesUsersArr = values.typesUsersArr.filter((item, i) => findIndex !== i);
													}

													return {...item, isChecked: value}
												}

												return item;
											}))
										}
									/>
									<Text style={s`text-base mr-3`}>{item.name}</Text>
								</View>
							)}
							{errors.typesUsersArr && touched.gender ? (
								<Text style={s`text-red-900 text-base`}>{errors.typesUsersArr}</Text>
							) : ''}
						</View>
						<View style={s`mb-5`}>
							<TextInput
								placeholder='город'
								onChangeText={handleChange('city')}
								onBlur={handleBlur('city')}
								value={values.city}
								style={s`border-2 border-solid ${errors.city && touched.city ? 'border-red-900' : 'border-black-900'} text-base px-3 mb-1`}
							/>
							{errors.city && touched.city ? (
								<Text style={s`text-red-900 text-base`}>{errors.city}</Text>
							) : ''}
						</View>
						<View style={s`mb-5`}>
							<TouchableOpacity 
								style={s`w-full bg-orange-400 rounded-lg flex-row items-center justify-center py-2 mb-2`}
								onPress={chooseImage}
								activeOpacity={.7}
							>
								<Text style={s`text-white text-lg color-orange-900 mr-3`}>Загрузить фото</Text>
								<Feather name='download' size={25} color='#fff' />
							</TouchableOpacity>
							{image && 
								<View style={[s`flex-row`, {width: 140, height: 140}]}>
									<Image
										source={{uri: image?.uri}}
										style={s`w-full`}
										resizeMode='cover'
									/>
									<TouchableOpacity
										style={s`absolute top-1 right-1 bg-rose-500 rounded-full p-2`}
										onPress={resetPhoto}
										activeOpacity={.7}
									>
										<Feather name='delete' size={20} color='#fff' />
									</TouchableOpacity>
								</View>
							}
						</View>
						{infoText && <View style={s`mb-5`}>
							<Text style={s`text-red-900 text-base`}>{infoText}</Text>
						</View>}
						<TouchableOpacity 
							style={s`${isDisabledBtn ? 'bg-violet-500' : 'bg-violet-700'} border-rose-700 py-3`}
							onPress={handleSubmit}
							activeOpacity={.7}
							disabled={isDisabledBtn}
						>
							<Text style={s`text-white text-center text-lg`}>Зарегестрироваться</Text>
						</TouchableOpacity>
					</View>
				)}
			</Formik>
		</>
	)
})

export default Register;