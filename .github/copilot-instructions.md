# Copilot Instructions

This is a GitHub Pages Jekyll blog using the "So Simple" theme, focused on technical content in Portuguese about mathematics, data science, programming, and RPG campaigns.

## Architecture

- **Theme**: Remote Jekyll theme `mmistakes/so-simple-theme` (not local files)
- **Content**: Portuguese technical blog with math/data science posts, RPG campaign notes
- **Build**: GitHub Pages with Jekyll (see `Gemfile` and `_config.yml`)
- **Custom code**: Python scripts in `/code/` for data analysis (e.g., `dice.py`)

## Key Patterns

### Blog Posts
- Use `YYYY-MM-DD-title.md` format in `_posts/`
- Minimal frontmatter: `title` and `date` only
- Math support enabled via `mathjax: true` in `_config.yml`
- Code blocks in Portuguese with explanatory context
- Example: See `_posts/2024-04-20-Transcricao_e_diarizacao.md`

### Content Organization
- **Campaigns**: RPG session notes in `/campanhas/` (layout: `post`)
- **Code**: Standalone Python analysis scripts in `/code/`
- **Datasets**: CSV files for data science posts in `/datasets/`
- **Images**: Post assets in `/images/[post-name]/`
- **Drafts**: Work-in-progress in `_drafts/`

### Custom Layouts & Data
- Navigation configured in `_data/navigation.yml`
- Custom layouts inherit from theme's base templates
- SASS customizations extend theme's styles in `_sass/`

## Development Workflow

### Local Development
```bash
bundle exec jekyll serve --livereload    # Local development
bundle exec jekyll build                 # Production build
rake preview                             # Theme development (uses /example)
```

### Creating Content
- **Blog post**: Add `YYYY-MM-DD-title.md` to `_posts/` with minimal frontmatter
- **Campaign notes**: Add to `/campanhas/` with `layout: post`
- **Static pages**: Add `.md` files to root (auto-routed by Jekyll)
- **Code examples**: Place in `/code/` and reference from posts

### Math & Code
- Use `$$` for math blocks (MathJax enabled)
- Include Python code snippets with explanatory Portuguese text
- Store data files in `/datasets/` for reproducible examples

## Domain & Deployment
- Custom domain: `mizerkowski.com.br` (see `CNAME`)
- Auto-deployed via GitHub Pages on push to `master`
- No manual build process - GitHub handles Jekyll compilation

## Content Style
- **Language**: Portuguese for all content
- **Tone**: Educational/explanatory for technical concepts
- **Examples**: Concrete code examples with real datasets
- **Structure**: Context → Implementation → Results pattern

When adding new posts, follow the established pattern of explaining concepts in Portuguese with practical Python implementations and mathematical foundations.