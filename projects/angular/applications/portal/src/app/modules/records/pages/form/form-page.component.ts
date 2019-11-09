import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CollectionService, RecordService } from '@app/core/http';
import { Collection, Record } from '@app/shared/models';

@Component({
  templateUrl: 'form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
})
export class RecordsFormPageComponent implements OnInit {
  public collection: Collection;
  public error: string;
  public form: FormGroup;

  private data: Record;

  constructor(
    private activatedRouter: ActivatedRoute,
    private collectionService: CollectionService,
    private formBuilder: FormBuilder,
    private recordService: RecordService,
  ) {}

  public ngOnInit() {
    this.activatedRouter.paramMap.subscribe(async params => {
      const _id = params.get('_id');
      const collectionId = params.get('collectionId');
      const databaseId = params.get('databaseId');

      this.collection = await this.collectionService.findOne(databaseId, collectionId);

      if (_id !== 'new') {
        this.data = await this.recordService.findOne(databaseId, collectionId, _id);
      }

      this.setupForm();
    });
  }

  public addArrayItem(key: string) {
    const formArray = this.form.controls[key] as FormArray;

    switch (this.collection.jsonSchema.properties[key].items.type) {
      case 'boolean':
        formArray.push(this.formBuilder.control(false));
        break;

      case 'number':
        formArray.push(this.formBuilder.control(0));
        break;

      case 'string':
        formArray.push(this.formBuilder.control(''));
        break;
    }
  }

  public removeArrayItem(key: string, index: number) {
    const formArray = this.form.controls[key] as FormArray;
    formArray.removeAt(index);
  }

  public async save() {
    if (this.form.invalid) {
      this.form.get('name').markAsTouched();

      return;
    }

    const properties = Object.entries(this.collection.jsonSchema.properties).reduce(
      (accumulator, [key, options]) => {
        const { type } = options as any;
        accumulator[key] = this.getValue(type, this.form.get(key).value);

        return accumulator;
      },
      {},
    );

    const values = {
      collectionId: this.collection._id,
      databaseId: this.collection.databaseId,
      properties,
    };

    if (this.data._id) {
      this.update(values);
    } else {
      this.create(values);
    }
  }

  private async create(data: Partial<Record>) {
    try {
      await this.recordService.create(data);
    } catch (e) {
      this.error = 'That name is already taken.';
    }
  }

  private getValue(type: string, value: any) {
    switch (type) {
      case 'array':
        return value ? value : [];

      case 'boolean':
        return value ? value : false;

      case 'number':
        return value ? value : 0;

      case 'string':
        return value ? value : '';
    }
  }

  private setupForm(): void {
    this.data = this.data || new Record();

    const arrays = {};
    const options = {};

    if (this.collection.jsonSchema && this.collection.jsonSchema.properties) {
      Object.entries(this.collection.jsonSchema.properties).forEach(([key, property]) => {
        const { required } = this.collection.jsonSchema;
        const { properties } = this.data;
        const { type } = property as any;

        const value = this.getValue(type, properties && properties[key] ? properties[key] : null);

        const validators = [];
        if (required && required.includes(key)) {
          validators.push(Validators.required);
        }

        if (property.type === 'array') {
          arrays[key] = this.formBuilder.array(
            properties && properties[key] ? properties[key] : [],
          );
        } else {
          options[key] = this.formBuilder.control(value, validators);
        }
      }, this);
    }

    Object.keys(arrays).forEach(key => (options[key] = arrays[key]));
    this.form = this.formBuilder.group(options);

    this.form.valueChanges.subscribe(() => (this.error = null));
  }

  private async update(data: Partial<Record>) {
    data._id = this.data._id;

    try {
      await this.recordService.update(data);
    } catch (e) {
      this.error = 'That name is already taken.';
    }
  }
}