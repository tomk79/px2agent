/**
 * px2project.js
 */
module.exports = function(px2agent, php_self, options){
	var _this = this;
	this.php_self = php_self;
	options = options||{};
	options.bin = options.bin||'php';
	this.options = options;
	// console.log(php_self);

	var phpjs = require('phpjs');

	/**
	 * Pickles2 にクエリを投げて、結果を受け取る
	 */
	this.query = function(path, opt){
		opt = opt||{};
		opt.output = opt.output||opt.o||undefined;
		opt.userAgent = opt.userAgent||opt.u||undefined;
		opt.success = opt.success||function(){};
		opt.complete = opt.complete||function(){};

		var cloptions = [];
		cloptions.push( this.php_self );
		if( opt.output ){
			cloptions.push( '-o' );
			cloptions.push( opt.output );
		}
		if( opt.userAgent ){
			cloptions.push( '-u' );
			cloptions.push( opt.userAgent );
		}
		cloptions.push( path );

		var data_memo = '';
		var rtn = spawn(
			this.options.bin ,
			cloptions ,
			{
				success: function( data ){
					opt.success(''+data);
					data_memo += data;
				} ,
				'complete': function( code ){
					opt.complete(data_memo, code);
				}
			}
		);
		return rtn;
	}
	/**
	 * PX=api.*を投げる
	 */
	function apiGet(cmd, path, param, cb){
		path = path||'/';
		param = param||{};
		param = (function(param){
			var aryParam = [];
			for( var idx in param ){
				aryParam.push( phpjs.urlencode(idx)+'='+phpjs.urlencode(param[idx]) )
			}
			return '&'+aryParam.join('&');
		})(param);
		cb = cb||function(){};
		return _this.query(
			path+'?PX='+cmd+param ,
			{
				"complete": function(data, code){
					data = JSON.parse(data);
					cb( data );
				}
			}
		);
	}

	/**
	 * バージョン番号を取得する
	 */
	this.get_version = function(cb){
		return apiGet('api.get.version', '/', {}, cb);
	}


	/**
	 * configデータを取得する
	 */
	this.get_config = function(cb){
		return apiGet('api.get.config', '/', {}, cb);
	}

	/**
	 * サイトマップデータを取得する
	 */
	this.get_sitemap = function(cb){
		return apiGet('api.get.sitemap', '/', {}, cb);
	}

	/**
	 * pathまたはidからページ情報を得る
	 */
	this.get_page_info = function(path, cb){
		return apiGet('api.get.page_info', '/', {
			"path":path
		}, cb);
	}

	/**
	 * PX=api.get.parent
	 */
	this.get_parent = function(path, cb){
		return apiGet('api.get.parent', path, {}, cb);
	}

	/**
	 * 子階層のページの一覧を取得する
	 */
	this.get_children = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.children', path, options, cb);
	}

	/**
	 * 兄弟ページの一覧を取得する
	 */
	this.get_bros = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.bros', path, options, cb);
	}

	/**
	 * 次の兄弟ページを取得する
	 */
	this.get_bros_next = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.bros_next', path, options, cb);
	}

	/**
	 * 前の兄弟ページを取得する
	 */
	this.get_bros_prev = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.bros_prev', path, options, cb);
	}

	/**
	 * 次のページを取得する
	 */
	this.get_next = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.next', path, options, cb);
	}

	/**
	 * 前のページを取得する
	 */
	this.get_prev = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.prev', path, options, cb);
	}

	/**
	 * PX=api.get.breadcrumb_array
	 */
	this.get_breadcrumb_array = function(path, cb){
		return apiGet('api.get.breadcrumb_array', path, {}, cb);
	}

	/**
	 * PX=api.get.dynamic_path_info&path={$path}
	 */
	this.get_dynamic_path_info = function(path, cb){
		return apiGet('api.get.dynamic_path_info', '/', {
			"path":path
		}, cb);
	}

	/**
	 * PX=api.get.path_homedir
	 */
	this.get_path_homedir = function(cb){
		return apiGet('api.get.path_homedir', '/', {}, cb);
	}

	/**
	 * PX=api.get.path_controot
	 */
	this.get_path_controot = function(cb){
		return apiGet('api.get.path_controot', '/', {}, cb);
	}

	/**
	 * PX=api.get.path_docroot
	 */
	this.get_path_docroot = function(cb){
		return apiGet('api.get.path_docroot', '/', {}, cb);
	}

	/**
	 * PX=api.get.path_content
	 */
	this.get_path_content = function(path, cb){
		return apiGet('api.get.path_content', path, {}, cb);
	}

	/**
	 * PX=api.get.path_files&path_content={$path}
	 */
	this.path_files = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.path_files', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * PX=api.get.realpath_files&path_content={$path}
	 */
	this.realpath_files = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.realpath_files', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * PX=api.get.path_files_cache&path_content={$path}
	 */
	this.path_files_cache = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.path_files_cache', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * PX=api.get.realpath_files_cache&path_content={$path}
	 */
	this.realpath_files_cache = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.realpath_files_cache', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * PX=api.get.realpath_files_private_cache&path_content={$path}
	 */
	this.realpath_files_private_cache = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.realpath_files_private_cache', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * PX=api.get.domain
	 */
	this.get_domain = function(cb){
		return apiGet('api.get.domain', '/', {}, cb);
	}

	/**
	 * PX=api.get.directory_index
	 */
	this.get_directory_index = function(cb){
		return apiGet('api.get.directory_index', '/', {}, cb);
	}

	/**
	 * PX=api.get.directory_index_primary
	 */
	this.get_directory_index_primary = function(cb){
		return apiGet('api.get.directory_index_primary', '/', {}, cb);
	}

	/**
	 * PX=api.get.path_proc_type
	 */
	this.get_path_proc_type = function(path, cb){
		return apiGet('api.get.path_proc_type', path, {}, cb);
	}

	/**
	 * PX=api.get.href&linkto={$path_linkto}
	 */
	this.href = function(path_linkto, cb){
		return apiGet('api.get.href', '/', {
			"linkto":path_linkto
		}, cb);
	}

	/**
	 * PX=api.is.match_dynamic_path&path={$path}
	 */
	this.is_match_dynamic_path = function(path, cb){
		return apiGet('api.is.match_dynamic_path', '/', {
			"path":path
		}, cb);
	}

	/**
	 * PX=api.is.page_in_breadcrumb&path={$path}
	 */
	this.is_page_in_breadcrumb = function(path, path_in, cb){
		return apiGet('api.is.page_in_breadcrumb', path, {
			"path":path_in
		}, cb);
	}

	/**
	 * PX=api.is.ignore_path&path={$path}
	 */
	this.is_ignore_path = function(path, cb){
		return apiGet('api.is.ignore_path', '/', {
			"path":path
		}, cb);
	}


	/**
	 * パブリッシュする
	 */
	this.publish = function(opt){
		opt = opt||{};
		if( !opt.path_region ){
			opt.path_region = '';
		}

		return this.query(
			'/?PX=publish.run&path_region='+phpjs.urlencode(opt.path_region) ,
			opt
		);
	}

	/**
	 * キャッシュを削除する
	 */
	this.clearcache = function(opt){
		opt = opt||{};

		return this.query(
			'/?PX=clearcache' ,
			opt
		);
	}




	/**
	 * システムコマンドを実行する(spawn)
	 */
	function spawn(cmd, cliOpts, opts){
		opts = opts||{};
		if( opts.cd ){
			process.chdir( opts.cd );
		}
		// console.log( opts.cd );
		// console.log( process.cwd() );

		var proc = require('child_process').spawn(cmd, cliOpts);
		if( opts.success ){ proc.stdout.on('data', opts.success); }
		if( opts.error ){ proc.stderr.on('data', opts.error); }
		if( opts.complete ){ proc.on('close', opts.complete); }

		if( opts.cd ){
			process.chdir( _pathCurrentDir );
		}
		// console.log( process.cwd() );

		return proc;
	}

	/**
	 * get_children() へ渡されるオプションを調整する
	 * この形式のオプションは、get_bros(), get_bros_next(), get_bros_prev(), get_next(), get_prev() でも共通です。
	 */
	function sitemap_children_params(options){
		function boolize(val){
			if(typeof(val) === typeof(null) || val === undefined){
				val = null;
			}else if(typeof(val) === typeof('string')){
				switch( val ){
					case 'true':
					case '1':
						val = 'true'; break;
					case 'false':
					case '0':
						val = 'false'; break;
				}
			}else{
				val = (val?'true':'false')
			}
			return val;
		}
		options = options||{};
		var rtn = {};
		rtn['filter'] = boolize(options['filter']);
		return rtn;
	}


}