import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'api-trigger',
	name: 'API Trigger',
	icon: 'sync',
	description: 'Display a button to trigger custom APIs',
	component: InterfaceComponent,
	hideLabel: true,
	hideLoader: true,
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
	options: ({ collection }) => [
		{
			field: 'layout',
			name: 'Layout',
			type: 'string',
			schema: {
				default_value: 'vertical',
			},
			meta: {
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Horizontal', value: 'horizontal' },
						{ text: 'Vertical', value: 'vertical' },
					],
				},
			},
		},
		{
			field: 'triggers',
			name: 'Triggers',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					fields: [
						{
							field: 'label',
							name: 'Label',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'input',
							},
						},
						{
							field: 'size',
							name: 'Size',
							type: 'string',
							schema: {
								default_value: '',
							},
							meta: {
								width: 'half',
								interface: 'select-dropdown',
								options: {
									choices: [
										{ text: 'x-small', value: 'x-small' },
										{ text: 'small', value: 'small' },
										{ text: 'default', value: '' },
										{ text: 'large', value: 'large' },
										{ text: 'x-large', value: 'x-large' },
									],
								},
							},
						},
						{
							field: 'type',
							name: 'Type',
							type: 'string',
							schema: {
								default_value: 'normal',
							},
							meta: {
								width: 'half',
								interface: 'select-dropdown',
								default_value: 'normal',
								options: {
									choices: [
										{ text: 'Primary', value: 'primary' },
										{ text: 'Normal', value: 'normal' },
										{ text: 'Info', value: 'info' },
										{ text: 'Success', value: 'success' },
										{ text: 'Warning', value: 'warning' },
										{ text: 'Danger', value: 'danger' },
									],
								},
							},
						},
						{
							field: 'icon',
							name: 'Icon',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'select-icon',
							},
						},
						{
							field: 'url',
							name: 'URL',
							type: 'string',
							meta: {
								width: 'full',
								interface: 'input',
								options: {
									placeholder: '/exchange/orders/{{id}}',
									font: 'monospace',
								},
							},
						},
						{
							field: 'params',
							name: 'Params',
							type: 'string',
							meta: {
								width: 'full',
								interface: 'input',
								options: {
									placeholder: 'buy,from,amount',
									font: 'monospace',
								},
							},
						},
						{
							field: 'method',
							name: 'Method',
							type: 'string',
							schema: {
								default_value: 'GET',
							},
							meta: {
								interface: 'select-dropdown',
								width: 'half',
								options: {
									choices: [
										{ text: 'GET', value: 'GET' },
										{ text: 'POST', value: 'POST' },
										{ text: 'PUT', value: 'PUT' },
										{ text: 'PATCH', value: 'PATCH' },
										{ text: 'DELETE', value: 'DELETE' },
									],
								},
							},
						},
						{
							field: 'updateField',
							name: 'UpdateField',
							type: 'string',
							meta: {
								width: 'full',
								interface: 'input',
								options: {
									placeholder: 'buy,from,amount',
									font: 'monospace',
								},
							},
						},
						{
							field: 'reload',
							name: 'Reload',
							type: 'boolean',
							schema: {
								default_value: false,
							},
							meta: {
								interface: 'boolean',
								width: 'half',
							},
						},
						{
							field: 'successText',
							name: 'SuccessText',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Request success!',
									font: 'monospace',
								},
							},
						},
						{
							field: 'errorText',
							name: 'ErrorText',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Request failed!',
									font: 'monospace',
								},
							},
						},
						{
							field: 'loadingText',
							name: 'LoadingText',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Request is process!',
									font: 'monospace',
								},
							},
						},
						{
							field: 'dialog',
							name: 'Dialog',
							type: 'boolean',
							schema: {
								default_value: true,
							},
							meta: {
								interface: 'boolean',
								width: 'half',
							},
						},
						{
							field: 'disabledConditions',
							name: 'Disabled Conditions',
							type: 'json',
							meta: {
								interface: 'system-filter',
								options: {
									collectionName: collection,
								},
							},
						},
					],
				},
			},
		},
	],
});
