import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../../core/services/plant.service';
import { ToastService } from '../../core/services/toast.service';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-admin-plant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AssetUrlPipe],
  template: `
    <section class="mb-10">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Catalog editor</p>
      <h1 class="font-serif text-6xl text-moss">{{ isEditMode ? 'Edit plant' : 'Add a new plant' }}</h1>
    </section>

    <form class="grid gap-8 lg:grid-cols-[1fr,0.9fr]" [formGroup]="form" (ngSubmit)="submit()">
      <section class="surface-card p-6">
        <div class="grid gap-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input class="field" type="text" formControlName="name" placeholder="Plant name" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea class="field min-h-40" formControlName="description" placeholder="Describe the plant, benefits, and care level"></textarea>
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <select class="field" formControlName="category">
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Medicinal">Medicinal</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Price</label>
              <input class="field" type="number" min="0" formControlName="price" placeholder="0" />
            </div>
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Stock</label>
              <input class="field" type="number" min="0" formControlName="stock" placeholder="0" />
            </div>
            <label class="mt-8 inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input type="checkbox" formControlName="isActive" class="h-4 w-4 rounded border-slate-300 text-moss" />
              Active listing
            </label>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Image URL</label>
            <input class="field" type="url" formControlName="imageUrl" placeholder="https://example.com/plant.jpg" />
          </div>
        </div>
      </section>

      <aside class="surface-card p-6">
        <h2 class="font-serif text-4xl text-moss">Image upload</h2>
        <p class="mt-2 text-sm text-slate-500">
          Upload a plant image or keep using an external URL. Uploaded files take precedence.
        </p>

        <label class="mt-6 flex cursor-pointer items-center justify-center rounded-3xl border border-dashed border-moss/20 bg-seed/60 px-4 py-10 text-center text-sm font-medium text-moss">
          <input type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)" />
          Choose image file
        </label>

        <div class="mt-6 overflow-hidden rounded-[2rem] bg-seed/80">
          <img
            [src]="(imagePreview() || form.controls.imageUrl.value || 'assets/placeholder-plant.svg') | assetUrl"
            alt="Plant preview"
            class="h-72 w-full object-cover"
          />
        </div>

        <button type="submit" class="btn-primary mt-6 w-full" [disabled]="submitting()">
          {{ submitting() ? 'Saving...' : isEditMode ? 'Update plant' : 'Create plant' }}
        </button>
      </aside>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPlantFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly plantService = inject(PlantService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly plantId = Number(this.route.snapshot.paramMap.get('plantId'));
  readonly isEditMode = Number.isFinite(this.plantId) && this.plantId > 0;
  readonly submitting = signal(false);
  readonly imagePreview = signal<string | null>(null);

  private selectedFile: File | null = null;

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['Indoor', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    isActive: [true]
  });

  constructor() {
    if (this.isEditMode) {
      this.plantService.getPlantById(this.plantId).subscribe((plant) => {
        this.form.patchValue({
          name: plant.name,
          description: plant.description,
          category: plant.category,
          price: plant.price,
          stock: plant.stock,
          imageUrl: plant.imageUrl,
          isActive: plant.isActive
        });
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const value = this.form.getRawValue();
    formData.append('name', value.name);
    formData.append('description', value.description);
    formData.append('category', value.category);
    formData.append('price', String(value.price));
    formData.append('stock', String(value.stock));
    formData.append('isActive', String(value.isActive));

    if (value.imageUrl) {
      formData.append('imageUrl', value.imageUrl);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request = this.isEditMode
      ? this.plantService.updatePlant(this.plantId, formData)
      : this.plantService.createPlant(formData);

    this.submitting.set(true);
    request.subscribe({
      next: () => {
        this.toastService.success(`Plant ${this.isEditMode ? 'updated' : 'created'} successfully.`);
        this.router.navigateByUrl('/admin/plants');
      },
      error: () => {
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
      }
    });
  }
}
