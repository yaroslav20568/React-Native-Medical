import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Platform, GestureResponderEvent } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { s } from "react-native-wind";
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { observer } from 'mobx-react-lite';
import { genders, siteUrl } from '../../constants';
import { IImage, ITypeUser, IUser, IUserFormValues, IUserFormRegister } from '../../types';
import { userStore } from '../../mobx';

interface IProps {
	typesUsers: Array<ITypeUser>;
	userId: number | undefined;
	hideModal: () => void;
}

const SignupSchema = Yup.object().shape({
	email: Yup.string().email('Не корректный email')
		.min(2, 'От 2 символов')
		.max(30, 'до 30 символов'),
	password: Yup.string()
		.min(6, 'От 6 символов')
		.max(16, 'до 16 символов'),
	gender: Yup.string(),
	typesUsersArr: Yup.array().of(Yup.number()),
	city: Yup.string()
		.min(2, 'От 2 символов')
		.max(16, 'до 16 символов')
		.matches(/^([a-zа-яё]+)$/i, 'Цифры или пробелы не должны присутствовать')
});

const UserUpdateForm = observer(({ typesUsers, userId, hideModal }: IProps) => {
	const [typesUsersArr, setTypesUsersArr] = useState<ITypeUser[]>(typesUsers);
	const formValues: IUserFormValues = {email: '', password: '', gender: '', typesUsers: [], city: '', file: null, role: 'User'};
	const [image, setImage] = useState<IImage | null>(null);
	const [isDisabledBtn, setIsDisabledBtn] = useState<boolean>(false);

	const chooseImage = async () => {
		const options = {
      mediaType: 'photo' as const
    };

    launchImageLibrary(options, (currentImage) => {
      if (currentImage.assets) {
				setImage({
					name: currentImage.assets[0].fileName,
					type: currentImage.assets[0].type,
					uri: Platform.OS === "android" ? currentImage.assets[0].uri : currentImage.assets[0].uri?.replace("file://", "")
				});
      }
    });
	}

	const resetFormValues = (resetForm: () => void, setFieldValue: (field: string, value: any) => void) => {
		resetForm();
		setFieldValue('typesUsers', []);
		resetPhoto();
		setTypesUsersArr(typesUsers);
	}

	const resetPhoto = () => {
		setImage(null);
	}

	return (
		<>
			<Formik
				initialValues={formValues}
				validationSchema={SignupSchema}
				onSubmit={(values, { resetForm, setFieldValue }) => {
					const sortTypesUsers = values.typesUsers.slice().sort(function (a, b) {return a - b;})
					values = {...values, typesUsers: sortTypesUsers, file: image};
					const formData: IUserFormRegister = {...values, typesUsers: values.typesUsers.join(',')};

					setIsDisabledBtn(true);

					const sendData = new FormData();

					for (let key in formData) {
						if(formData[key as keyof IUserFormValues]) {
							sendData.append(key, formData[key as keyof IUserFormValues]);
						}
					}

					axios<IUser>({
						url: `${siteUrl}/api/user/${userId}`,
						method: 'PUT',
						headers: {
							'Accept': 'multipart/form-data',
							'Content-Type': 'multipart/form-data'
						},
						data: sendData
					})
					.then((response) => {
						if(response.status === 200) {
							resetForm();
							setFieldValue('typesUsers', []);
							resetPhoto();
							setTypesUsersArr(typesUsers);
							userStore.setUserData(response.data);
							hideModal();
						}
					})
					.finally(() => setIsDisabledBtn(false))
				}}
			>
				{({ handleChange, handleBlur, handleSubmit, values, touched, errors, resetForm, setFieldValue }) => (
					<View>
						<View style={s`flex-row justify-end`}>
							<TouchableOpacity
								onPress={() => resetFormValues(resetForm, setFieldValue)}
								activeOpacity={.7}
								style={s`mb-3`}
							>
								<Feather name='delete' size={30} />
							</TouchableOpacity>
						</View>
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
								items={genders}
							/>
						</View>
						<View style={s`mb-5`}>
							<Text style={s`text-base mb-2`}>тип пользователя:</Text>
							{typesUsersArr.map((typeUser, currIndex) => 
								<View style={s`flex-row items-center mb-1`} key={`checkbox_${currIndex}`}>
									<BouncyCheckbox
										size={20}
										fillColor='#a8a29e'
										unFillColor='transparent'
										textComponent={<Text style={s`text-base ml-3`}>{typeUser.name}</Text>}
										iconStyle={s`text-gray-400 rounded-none`}
										innerIconStyle={s`border-2 rounded-none`}
										isChecked={typeUser.isChecked}
										onPress={value => 
											setTypesUsersArr((prevTypesUsersArr) => 
												prevTypesUsersArr.map((prevTypeUser, index) => {
													if(currIndex === index) {
														if(!prevTypeUser.isChecked && !values.typesUsers.includes(currIndex)) {
															values.typesUsers = [...values.typesUsers, currIndex];
														} else {
															const findIndex = values.typesUsers.findIndex((num) => currIndex === num);
															values.typesUsers = values.typesUsers.filter((_, i) => findIndex !== i);
														}
	
														return {...prevTypeUser, isChecked: value}
													}
	
													return prevTypeUser;
												})
											)
										}
									/>
								</View>
							)}
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
						<TouchableOpacity 
							style={s`${isDisabledBtn ? 'bg-violet-500' : 'bg-violet-700'} border-rose-700 py-3`}
							onPress={handleSubmit as (e?: GestureResponderEvent) => void}
							activeOpacity={.7}
						>
							<Text style={s`text-white text-center text-lg`}>Обновить данные</Text>
						</TouchableOpacity>
					</View>
				)}
			</Formik>
		</>
	)
})

export default UserUpdateForm;