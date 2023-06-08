import { makeObservable, observable, action, runInAction } from "mobx";
import axios from "axios";
import { IInstitutionRB } from '../types';

interface IRespData {
	status: string;
	data: {
		current_page: number;
		total_pages: number;
		items: Array<IInstitutionRB>;
	}
}

class InstitutionsStore {
	isLoading: boolean;
	currentPage: number;
	totalPages: number;
	institutions: Array<IInstitutionRB>;
	// searchValue: string;

	constructor() {
		this.isLoading = false;
		this.currentPage = 1;
		this.totalPages = 1;
		this.institutions = [];
		// this.searchValue = '';
		makeObservable(this, {
			isLoading: observable,
			currentPage: observable,
			totalPages: observable,
			institutions: observable,
			loadInstitutions: action,
			// setSearchValue: action
		})
	}

	// setSearchValue(value: string) {
	// 	console.log(value);
	// 	this.searchValue = value;
	// }

	loadInstitutions(searchValue: string, region: string, cityId: number | '') {
		this.isLoading = true;
		// axios<IRespData>(`http://dev6.dewpoint.of.by/api/laboratories?name=${this.searchValue}`)
		axios<IRespData>(`http://dev6.dewpoint.of.by/api/laboratories?name=${searchValue}&region=${region}&city_id=${cityId}`)
    .then(({ data }) => {
			runInAction(() => {
				this.currentPage = data.data.current_page;
				this.totalPages = data.data.total_pages;
				this.institutions = data.data.items;
				this.isLoading = false;
			});
		})
	}

	get getCities() {
		return this.institutions.map(institution => { return {label: institution.city_id.name, value: institution.city_id.id} });
	}

	get getTypesInstitution() {
		return this.institutions.map(institution => institution.type_id);
	}
}

export default new InstitutionsStore();