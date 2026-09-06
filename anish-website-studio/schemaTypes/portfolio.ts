import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'portfolio',
    title: 'Portfolio',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                    description: 'Important for SEO and accessiblity.',
                }),
            ],
        }),
        defineField({
            name: 'caption',
            title: 'Caption',
            type: 'text',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            description: 'Drives the filter chips above the gallery. Chips appear once two or more categories are in use.',
            options: {
                list: [
                    {title: 'Mammals', value: 'Mammals'},
                    {title: 'Birds', value: 'Birds'},
                    {title: 'Reptiles', value: 'Reptiles'},
                    {title: 'Insects', value: 'Insects'},
                    {title: 'Wetlands', value: 'Wetlands'},
                    {title: 'Landscapes', value: 'Landscapes'},
                ],
                layout: 'dropdown',
            },
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
            description: 'Shown in the caption rail, e.g. "Kabini" or "Ranganathittu".',
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            description: 'Shown in the caption rail alongside the location.',
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            description: 'Lower numbers appear first in the flow. Leave blank to fall back to upload date.',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'location',
            media: 'image',
        },
    },
})
