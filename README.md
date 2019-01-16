# [Zevenet GUI Community Edition](https://www.zevenet.com)
Zevenet GUI CE is the web interface to manage <a href="https://github.com/zevenet/zlb">Zevenet Community Edition</a> in an easy and intuitive way. It is based on <a href="https://github.com/akveo/ngx-admin">ngx-admin</a> template with Angular 6+, Bootstrap 4 and Nebular.

### Dashboard screenshot

<img src="https://www.zevenet.com/wp-content/uploads/2018/12/Zevenet_Community_5.9_web_gui-1024x513.jpg"/>

### What's included:

- Dashboard section
- LSLB section
- DSLB section
- Monitoring section
- Network section
- System section

### Features

This project is based in <a href="https://github.com/akveo/ngx-admin">ngx-admin</a> template. With the following features:

- Angular 6+ & Typescript
- Bootstrap 4+ & SCSS
- Responsive layout
- High resolution
  
## Repository Contents
In this repository you'll find the source code usually placed into the folder `/src/app/` with the following structure:
- **@core/zevenet/**: Zevenet GUI core, with common components, auth module, services, etc.
- **@theme/**: Layout and style files. 
- **pages/**: Default folder where files of every section are placed, organized by directories.

## Installation and updates

This git repository only contains the source code, the installable packages based in this code are updated in our Zevenet APT repos, you can use them configuring your Debian Baster system as follows: 

```
root@zevenetlb#> wget -O - http://repo.zevenet.com/zevenet.com.gpg.key | apt-key add -

```

### Dependencies
Zevenet CE depends of <a href="https://github.com/zevenet/zlb">Zevenet Community Edittion >= 5.9</a>

### Updates
Please use the Zevenet APT repo in order to check if updates are available. 

## Documentation
Zevenet GUI CE has a complete <a href="https://www.zevenet.com/knowledge-base_category/community-edition-v5-9-administration-guide/">documentation</a>, for each different screen.

## How can I support developers?
- Star our GitHub repo
- Create pull requests, submit bugs, suggest new features or documentation updates
- Stay updated with the [Zevenet blog](https://www.zevenet.com/blog/)
- Get in contact with the community through the [distribution list](https://www.zevenet.com/support/resources/#distributionlist)
- Follow us on [Twitter](https://twitter.com/zevenet)

## License
<a href="https://github.com/zevenet/zevenet-gui-ce/blob/master/LICENSE"> GNU Affero General Public License</a>

## From Zevenet
Made by [Zevenet team](http://zevenet.com/). Copyright (C) 2019-today ZEVENET SL. 
We're always glad to receive your feedback!


