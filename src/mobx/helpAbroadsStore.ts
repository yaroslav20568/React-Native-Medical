import { makeObservable, observable, action, runInAction } from "mobx";
import axios from "axios";
import { ISelectItem, IInstitution } from '../types';
import { siteUrl } from "../constants";
import { sortArray } from "../helpers";
import { institutionsStore } from "./index";

interface IRespData {
	skip: number;
	totalSkip: number;
	items: Array<IInstitution>;
}

class HelpAbroadsStore {
	isLoading: boolean;
	skip: number;
	totalSkip: number;
	institutions: Array<IInstitution>;
	isLoadingMore: boolean;

	constructor() {
		this.isLoading = false;
		this.skip = 0;
		this.totalSkip = 0;
		this.institutions = [];
		this.isLoadingMore = false;

		makeObservable(this, {
			isLoading: observable,
			skip: observable,
			totalSkip: observable,
			institutions: observable,
			loadInstitutions: action,
			loadMoreInstitutions: action,
			isLoadingMore: observable
		})
	}

	loadInstitutions(searchValue: string, cityId: number | '', countryId: number | '', typeInstitutionId: number | '', typesUser: Array<number>) {
		this.isLoading = true;
		axios<IRespData>(`${siteUrl}/api/help-abroads?name=${searchValue}&cityId=${cityId}&countryId=${countryId}&typeId=${typeInstitutionId}&typesUsers=${sortArray(typesUser).join(',')}`)
    .then(({ data }) => {
			runInAction(() => {
				this.skip = data.skip;
				this.totalSkip = data.totalSkip;
				this.institutions = data.items;
				this.isLoading = false;
			});
		})
	}

	loadMoreInstitutions() {
		if(this.skip < this.totalSkip) {
			this.isLoadingMore = true;
			axios<IRespData>(`${siteUrl}/api/help-abroads?skip=${this.skip + 10}`)
			.then(({ data }) => {
				runInAction(() => {
					this.skip = data.skip;
					this.totalSkip = data.totalSkip;
					this.institutions = [...this.institutions, ...data.items];
					this.isLoadingMore = false;
				});
			})
		}
	}

	get getCities() {
		const citiesInstitution: Array<ISelectItem> = [];
		this.institutions.forEach(institution => {
			const bool = citiesInstitution.some(cityInstitution => cityInstitution?.value == institution.city?.id);

			if(!bool) {
				citiesInstitution.push({label: institution.city?.name, value: institution.city?.id});
			}
		});

		return citiesInstitution;
	}

	get getСountries() {
		const countriesInstitution: Array<ISelectItem> = [];
		this.institutions.forEach(institution => {
			const bool = countriesInstitution.some(cityInstitution => cityInstitution?.value == institution.city?.country.id);

			if(!bool) {
				countriesInstitution.push({label: institution.city?.country.name, value: institution.city?.country.id});
			}
		});

		return countriesInstitution;
	}

	get getTypesInstitution() {
		const typesInstitution: Array<ISelectItem> = [];
		this.institutions.forEach(institution => {
			const bool = typesInstitution.some(typeInstitution => typeInstitution?.value == institution.type?.id);

			if(!bool) {
				typesInstitution.push({label: institution.type?.name, value: institution.type?.id});
			}
		});

		return typesInstitution;
	}

	get getTypesUser() {
		const typesUser: Array<ISelectItem> = [];
		this.institutions.forEach(institution => {
			institution.typesUsers.split(',').forEach(type => {
				const bool = typesUser.some(typeUser => typeUser?.value == +type);

				if(!bool) {
					typesUser.push({label: institutionsStore.typesUsers[+type].name, value: institutionsStore.typesUsers[+type].id - 1, isChecked: false});
				}
			});
		});

		return typesUser;
	}
}

export default new HelpAbroadsStore();