// utils/pipelineTemplates.js
export const PIPELINE_TEMPLATES = {
  // Generate template code based on pipeline type
  generateTemplate: (pipelineType) => {
    const timestamp = new Date().toLocaleString();
    
    const templates = {
      preprocessing: `# PREPROCESSING Pipeline Code
# Created on ${timestamp}

import kfp
from kfp import dsl
import kfp.components as components
from kfp.components import func_to_container_op



# Define component functions
def download_original_dataset(output: components.OutputPath(), original_dataset_uid: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    import os
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.file import FileUtility
    # initial credential
    credential_server = CredentialServer(
        host=auth_server['ip'],
        port=auth_server['port'],
        access_key=access_key,
        secret_key=secret_key,
        api_version=auth_server['version']
    )
    file_manager = FileUtility(credential_manager=credential_server, host=file_server['ip'], port=file_server['port'], api_version=file_server['version'])



    # download original dataset
    file_type = "dataset"
    downloaded_file = file_manager.download(
        file_type=file_type, file_path=original_dataset_uid)
    # save download original dataset to output path
    # print(downloaded_file.content)
    download_folder_path = output
    download_file_path = f"""{output}/original_dataset.zip"""
    os.makedirs(download_folder_path, exist_ok=True)
    with open(download_file_path, "wb") as file:
        file.write(downloaded_file.content)



def preprocessing(input: components.InputPath(), output: components.OutputPath()):
    import os
    import pandas as pd
    import numpy as np
    from mitlab_aiml_tools.pipeline.compress import CompressionUtility



    ############################# User import insert here #############################
    {{ user_import | indent(4) }}
    ####################################### End #######################################



    # decompress original dataset in input path
    input_file_path = f"""{input}/original_dataset.zip"""
    decompress_folder_path = "./original_dataset/"
    original_dataset_file_path = f"./original_dataset/original_dataset.{ original_dataset_filetype }"
    os.makedirs(decompress_folder_path, exist_ok=True)
    
    training_dataset_folder_path = "./training_dataset/"
    training_dataset_file_path = f"./training_dataset/training_dataset.{ training_dataset_filetype }"
    os.makedirs(training_dataset_folder_path, exist_ok=True)



    CompressionUtility.decompress(
        compressed_file_path=input_file_path, extract_path=decompress_folder_path)



    ############################## User code insert here ##############################
    {{ user_code | indent(4) }}
    ####################################### End #######################################



    # compress training dataset
    compress_folder_path = output
    compress_file_path = f"""{output}/training_dataset.zip"""
    os.makedirs(compress_folder_path, exist_ok=True)
    CompressionUtility.compress(
        source_path=training_dataset_folder_path, compressed_file_path=compress_file_path)



def upload_training_dataset(input: components.InputPath(), training_dataset_uid: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.file import FileUtility



    # initial credential
    credential_server = CredentialServer(
        host=auth_server['ip'],
        port=auth_server['port'],
        access_key=access_key,
        secret_key=secret_key,
        api_version=auth_server['version']
    )
    file_manager = FileUtility(credential_manager=credential_server, host=file_server['ip'], port=file_server['port'], api_version=file_server['version'])



    # upload training dataset
    upload_file_path = f"""{input}/training_dataset.zip"""



    print({f'file': open(upload_file_path, 'rb')})
    print({"file_path":training_dataset_uid})
    file_manager.upload(
        file_type="dataset",
        file={f'file': open(upload_file_path, 'rb')},
        file_path=training_dataset_uid
    )



# turn function into pipeline component(backend will process img_name_map)
download_original_dataset_op = func_to_container_op(
    download_original_dataset, base_image=img_name_map["download_original_dataset"])
preprocessing_op = func_to_container_op(
    preprocessing, base_image=img_name_map["preprocessing"])
upload_training_dataset_op = func_to_container_op(
    upload_training_dataset, base_image=img_name_map["upload_training_dataset"])



@dsl.pipeline(
    name='pipeline',
    description='pipeline example'
)
def pipeline(preprocessing_task_uid: str,original_dataset_uid: str, training_dataset_uid: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str, ):



    task1 = download_original_dataset_op(original_dataset_uid=original_dataset_uid,
                                         auth_server=auth_server, file_server=file_server, access_key=access_key, secret_key=secret_key)
    task1.set_cpu_request('0.5').set_cpu_limit('0.5')
    task1.set_memory_request('4000Mi').set_memory_limit('4000Mi')
    task1.set_caching_options(False)
    task1.set_image_pull_policy('Always')
    task1.add_pod_label(preprocessing_task_uid, 'download_original_dataset')



    task2 = preprocessing_op(input=task1.output)
    task2.set_cpu_request('0.5').set_cpu_limit('0.5')
    task2.set_memory_request('4000Mi').set_memory_limit('4000Mi')
    task2.set_caching_options(False)
    task2.set_image_pull_policy('Always')
    task2.add_pod_label(preprocessing_task_uid, 'preprocessing')



    task3 = upload_training_dataset_op(input=task2.output, training_dataset_uid=training_dataset_uid,
                                       auth_server=auth_server, file_server=file_server, access_key=access_key, secret_key=secret_key)
    task3.set_cpu_request('0.5').set_cpu_limit('0.5')
    task3.set_memory_request('4000Mi').set_memory_limit('4000Mi')
    task3.set_caching_options(False)
    task3.set_image_pull_policy('Always')
    task3.add_pod_label(preprocessing_task_uid, 'upload_training_dataset')



if __name__ == '__main__':
    kfp.compiler.Compiler().compile(pipeline, 'pipeline.yaml')
`,

      training: `# TRAINING Pipeline Code
# Created on ${timestamp}

import kfp
from kfp import dsl
import kfp.components as components
from kfp.components import func_to_container_op



# ===== Component 1: Download Dataset =====
def download_training_dataset(output: components.OutputPath(), training_dataset_uid: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    import os
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.file import FileUtility
    credential_server = CredentialServer(
        host=auth_server['ip'], port=auth_server['port'],
        access_key=access_key, secret_key=secret_key,
        api_version=auth_server['version']
    )
    file_manager = FileUtility(credential_manager=credential_server,
                                host=file_server['ip'], port=file_server['port'],
                                api_version=file_server['version'])
    file_type = "dataset"
    downloaded_file = file_manager.download(
        file_type=file_type, file_path=training_dataset_uid)
    download_folder_path = output
    download_file_path = f"{output}/training_dataset.zip"
    os.makedirs(download_folder_path, exist_ok=True)
    with open(download_file_path, "wb") as file:
        file.write(downloaded_file.content)



# ===== Component 2: Model Training =====
def training(input: components.InputPath(), output: components.OutputPath()):
    import os
    from mitlab_aiml_tools.pipeline.compress import CompressionUtility
    training_dataset_filetype = "npy"
    output_model_filetype = "h5"



    # User-defined imports placeholder
    import numpy as np
    from sklearn.model_selection import train_test_split
    {{IMPORTS}}



    input_file_path = f"{input}/training_dataset.zip"
    decompress_folder_path = "./training_dataset/"
    training_dataset_path = f"./training_dataset/training_dataset.{training_dataset_filetype}"
    os.makedirs(decompress_folder_path, exist_ok=True)



    model_folder_path = "./model/"
    model_file_path = f"./model/model.{output_model_filetype}"
    os.makedirs(model_folder_path, exist_ok=True)



    CompressionUtility.decompress(
        compressed_file_path=input_file_path, extract_path=decompress_folder_path)



    # Load data
    training_dataset = np.load(training_dataset_path, allow_pickle=True)
    x = np.array([item[0] for item in training_dataset])
    y = np.array([item[1] for item in training_dataset])
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
    x_test, x_val, y_test, y_val = train_test_split(x_test, y_test, test_size=0.5, random_state=42)



    # Model architecture placeholder
    {{MODEL_ARCHITECTURE}}



    # Compile and Train placeholder
    {{COMPILE_AND_TRAIN}}



    model.save(model_file_path)



    # Compress output model
    compress_folder_path = output
    compress_file_path = f"{output}/model.zip"
    os.makedirs(compress_folder_path, exist_ok=True)
    CompressionUtility.compress(source_path=model_folder_path,
                                  compressed_file_path=compress_file_path)



# ===== Component 3: Upload Model =====
def upload_model(input: components.InputPath(), model_uid: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.file import FileUtility
    credential_server = CredentialServer(
        host=auth_server['ip'], port=auth_server['port'],
        access_key=access_key, secret_key=secret_key,
        api_version=auth_server['version'])
    file_manager = FileUtility(credential_manager=credential_server,
                                host=file_server['ip'], port=file_server['port'],
                                api_version=file_server['version'])
    upload_file_path = f"{input}/model.zip"
    print("model_uid:" + model_uid)
    file_manager.upload(file_type="model",
                        file={'file': open(upload_file_path, 'rb')},
                        file_path=model_uid)



# ===== Operator Definitions =====
download_training_dataset_op = func_to_container_op(
    download_training_dataset, base_image=img_name_map["download_training_dataset"])
training_op = func_to_container_op(training, base_image=img_name_map["training"])
upload_model_op = func_to_container_op(
    upload_model, base_image=img_name_map["upload_model"])



# ===== Pipeline Definition =====
@dsl.pipeline(name='pipeline', description='pipeline example')
def pipeline(training_task_uid: str, training_dataset_uid: str, model_uid: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    task1 = download_training_dataset_op(training_dataset_uid=training_dataset_uid,
                                         auth_server=auth_server, file_server=file_server,
                                         access_key=access_key, secret_key=secret_key)
    task1.set_cpu_request('0.5').set_cpu_limit('0.5')\
        .set_memory_request('4000Mi').set_memory_limit('4000Mi')\
        .set_image_pull_policy('Always').set_caching_options(False)\
        .set_ephemeral_storage_request('1Gi').set_ephemeral_storage_limit('2Gi')\
        .add_pod_label(training_task_uid, 'download_training_dataset')



    task2 = training_op(input=task1.output)
    task2.add_pod_label(training_task_uid, 'training')



    # KFP hardware settings placeholder for the training task
    {{KFP_HARDWARE_SETTINGS}}



    task3 = upload_model_op(input=task2.output, model_uid=model_uid,
                            auth_server=auth_server, file_server=file_server,
                            access_key=access_key, secret_key=secret_key)
    task3.set_cpu_request('0.5').set_cpu_limit('0.5')\
        .set_memory_request('4000Mi').set_memory_limit('4000Mi')\
        .set_image_pull_policy('Always').set_caching_options(False)\
        .set_ephemeral_storage_request('1Gi').set_ephemeral_storage_limit('2Gi')\
        .add_pod_label(training_task_uid, 'upload_model')



# ===== Compile Pipeline =====
if __name__ == '__main__':
    kfp.compiler.Compiler().compile(pipeline, 'pipeline.yaml')
`,

      tuning: `# TUNING Pipeline Code
# Created on ${timestamp}

import kfp
from kfp import dsl
import kfp.components as components
from kfp.components import func_to_container_op

# Define component functions

def download_optimize_files(output: components.OutputPath(), training_dataset_uid: str, pretrain_model_uid: str, model_access_token: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    import os
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.file import FileUtility

    # AUTHENTICATE_MIDDLEWARE
    credential_server = CredentialServer(
        host=auth_server['ip'],
        port=auth_server['port'],
        access_key=access_key,
        secret_key=secret_key,
        api_version=auth_server['version']
    )
    # AI_ML_MT_CONNECTOR
    file_manager = FileUtility(credential_manager=credential_server,
                               host=file_server['ip'], port=file_server['port'], api_version=file_server['version'])

    # download training dataset
    downloaded_dataset = file_manager.download(
        file_type="dataset", file_path=training_dataset_uid)

    print(downloaded_dataset)

    # download pretrain model
    pretrain_model = file_manager.download(
        file_type="model",
        model_uid=pretrain_model_uid,
        model_access_token=model_access_token
    )

    print(pretrain_model)

    # save download training dataset and pretrain model to output path
    download_folder_path = output
    download_dataset_path = f"""{output}/training_dataset.zip"""
    download_model_path = f"""{output}/pretrain_model.zip"""
    os.makedirs(download_folder_path, exist_ok=True)
    with open(download_dataset_path, "wb") as file:
        file.write(downloaded_dataset.content)
    with open(download_model_path, "wb") as file:
        file.write(pretrain_model.content)
        print(pretrain_model.content)

def optimize(input: components.InputPath(), output: components.OutputPath(), config: dict):
    import os
    from mitlab_aiml_tools.pipeline.compress import CompressionUtility
    
    print('Your config input is =>', config)

    ############################# User config insert here #############################
    training_dataset_filetype = "npy"
    input_model_filetype = "h5"
    output_model_filetype = "h5"
    ####################################### End #######################################

    ############################# User import insert here #############################
    import numpy as np
    from sklearn.model_selection import train_test_split
    {{USER_IMPORTS}}
    ####################################### End #######################################

    # File path settings
    training_dataset_input_path = f"""{input}/training_dataset.zip"""
    pretrain_model_input_path = f"""{input}/pretrain_model.zip"""
    training_dataset_folder_path = "./training_dataset/"
    pretrain_model_folder_path = "./pretrain_model/"
    training_dataset_file_path = f"./training_dataset/training_dataset.{training_dataset_filetype}"
    pretrain_model_file_path = f"./pretrain_model/model.{input_model_filetype}"
    model_folder_path = "./model/"
    os.makedirs(model_folder_path, exist_ok=True)
    output_model_filename = f"./model/model.{output_model_filetype}"

    # Decompress
    os.makedirs(training_dataset_folder_path, exist_ok=True)
    CompressionUtility.decompress(
        compressed_file_path=training_dataset_input_path, extract_path=training_dataset_folder_path)

    os.makedirs(pretrain_model_folder_path, exist_ok=True)
    CompressionUtility.decompress(
        compressed_file_path=pretrain_model_input_path, extract_path=pretrain_model_folder_path)

    ############################## User code insert here ##############################
    {{USER_TUNING_CODE}}
    ####################################### End #######################################

    # compress training dataset
    compress_folder_path = output
    compress_file_path = f"""{output}/model.zip"""
    os.makedirs(compress_folder_path, exist_ok=True)
    CompressionUtility.compress(
        source_path=model_folder_path, compressed_file_path=compress_file_path)

def upload_model(input: components.InputPath(), model_uid: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.file import FileUtility

    # initial credential
    # AUTHENTICATE_MIDDLEWARE
    credential_server = CredentialServer(
        host=auth_server['ip'],
        port=auth_server['port'],
        access_key=access_key,
        secret_key=secret_key,
        api_version=auth_server['version']
    )
    print(credential_server)
    # AI_ML_MT_CONNECTOR
    file_manager = FileUtility(credential_manager=credential_server,
                               host=file_server['ip'], port=file_server['port'], api_version=file_server['version'])

    # upload model
    file_type = "model"
    upload_file_path = f"""{input}/model.zip"""
    print("model_uid:"+model_uid)
    file_manager.upload(
        file_type=file_type,
        file_path=model_uid,
        file={'file': open(upload_file_path, 'rb')}
    )

download_optimize_files_op = func_to_container_op(
    download_optimize_files, base_image=img_name_map["download_optimize_files"])
optimize_op = func_to_container_op(
    optimize, base_image=img_name_map["optimize"])
upload_model_op = func_to_container_op(
    upload_model, base_image=img_name_map["upload_model"])

@dsl.pipeline(
    name='pipeline',
    description='pipeline example'
)
def pipeline(optimization_task_uid: str, training_dataset_uid: str, pretrain_model_uid: str, model_access_token: str, auth_server: dict, file_server: dict, model_uid: str, access_key: str, secret_key: str, config: dict):

    task1 = download_optimize_files_op(training_dataset_uid=training_dataset_uid,
                                       pretrain_model_uid=pretrain_model_uid,
                                       model_access_token=model_access_token,
                                       auth_server=auth_server,
                                       file_server=file_server,
                                       access_key=access_key,
                                       secret_key=secret_key)
    task1.set_cpu_request('0.5').set_cpu_limit('0.5')
    task1.set_memory_request('4000Mi').set_memory_limit('4000Mi')
    task1.set_ephemeral_storage_request('1Gi').set_ephemeral_storage_limit('2Gi')
    task1.set_caching_options(False)
    task1.set_image_pull_policy('Always')
    task1.add_pod_label(optimization_task_uid, 'download_optimize_files')

    task2 = optimize_op(input=task1.output, config=config)
    {{HARDWARE_SETTINGS}}
    task2.set_caching_options(False)
    task2.set_image_pull_policy('Always')
    task2.add_pod_label(optimization_task_uid, 'optimize')

    task3 = upload_model_op(input=task2.output, model_uid=model_uid,
                            auth_server=auth_server, file_server=file_server, access_key=access_key, secret_key=secret_key)
    task3.set_cpu_request('0.5').set_cpu_limit('0.5')
    task3.set_memory_request('4000Mi').set_memory_limit('4000Mi')
    task3.set_ephemeral_storage_request('1Gi').set_ephemeral_storage_limit('2Gi')
    task3.set_caching_options(False)
    task3.set_image_pull_policy('Always')
    task3.add_pod_label(optimization_task_uid, 'upload_model')

if __name__ == '__main__':
    kfp.compiler.Compiler().compile(pipeline, 'pipeline.yaml')
`,

      retrain: `# RETRAIN Pipeline Code
# Created on ${timestamp}

import kfp
from kfp import dsl
import kfp.components as components
from kfp.components import func_to_container_op

# Define component functions

def download_optimize_files(output: components.OutputPath(), training_dataset_uid: str, pretrain_model_uid: str, model_access_token: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    import os
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.file import FileUtility

    # AUTHENTICATE_MIDDLEWARE
    credential_server = CredentialServer(
        host=auth_server['ip'],
        port=auth_server['port'],
        access_key=access_key,
        secret_key=secret_key,
        api_version=auth_server['version']
    )
    # AI_ML_MT_CONNECTOR
    file_manager = FileUtility(credential_manager=credential_server,
                               host=file_server['ip'], port=file_server['port'], api_version=file_server['version'])

    # download training dataset
    downloaded_dataset = file_manager.download(
        file_type="dataset", file_path=training_dataset_uid)

    print(downloaded_dataset)

    # download pretrain model
    pretrain_model = file_manager.download(
        file_type="model",
        model_uid=pretrain_model_uid,
        model_access_token=model_access_token
    )

    print(pretrain_model)

    # save download training dataset and pretrain model to output path
    download_folder_path = output
    download_dataset_path = f"""{output}/training_dataset.zip"""
    download_model_path = f"""{output}/pretrain_model.zip"""
    os.makedirs(download_folder_path, exist_ok=True)
    with open(download_dataset_path, "wb") as file:
        file.write(downloaded_dataset.content)
    with open(download_model_path, "wb") as file:
        file.write(pretrain_model.content)
        print(pretrain_model.content)

def optimize(input: components.InputPath(), output: components.OutputPath(), config: dict):
    import os
    from mitlab_aiml_tools.pipeline.compress import CompressionUtility
    
    print('Your config input is =>', config)

    ############################# User config insert here #############################
    training_dataset_filetype = "npy"
    input_model_filetype = "h5"
    output_model_filetype = "h5"
    ####################################### End #######################################

    ############################# User import insert here #############################
    import numpy as np
    from sklearn.model_selection import train_test_split
    {{USER_IMPORTS}}
    ####################################### End #######################################

    # File path settings
    training_dataset_input_path = f"""{input}/training_dataset.zip"""
    pretrain_model_input_path = f"""{input}/pretrain_model.zip"""
    training_dataset_folder_path = "./training_dataset/"
    pretrain_model_folder_path = "./pretrain_model/"
    training_dataset_file_path = f"./training_dataset/training_dataset.{training_dataset_filetype}"
    pretrain_model_file_path = f"./pretrain_model/model.{input_model_filetype}"
    model_folder_path = "./model/"
    os.makedirs(model_folder_path, exist_ok=True)
    output_model_filename = f"./model/model.{output_model_filetype}"

    # Decompress
    os.makedirs(training_dataset_folder_path, exist_ok=True)
    CompressionUtility.decompress(
        compressed_file_path=training_dataset_input_path, extract_path=training_dataset_folder_path)

    os.makedirs(pretrain_model_folder_path, exist_ok=True)
    CompressionUtility.decompress(
        compressed_file_path=pretrain_model_input_path, extract_path=pretrain_model_folder_path)

    ############################## User code insert here ##############################
    {{USER_RETRAINING_CODE}}
    ####################################### End #######################################

    # compress training dataset
    compress_folder_path = output
    compress_file_path = f"""{output}/model.zip"""
    os.makedirs(compress_folder_path, exist_ok=True)
    CompressionUtility.compress(
        source_path=model_folder_path, compressed_file_path=compress_file_path)

def upload_model(input: components.InputPath(), model_uid: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.file import FileUtility

    # initial credential
    # AUTHENTICATE_MIDDLEWARE
    credential_server = CredentialServer(
        host=auth_server['ip'],
        port=auth_server['port'],
        access_key=access_key,
        secret_key=secret_key,
        api_version=auth_server['version']
    )
    print(credential_server)
    # AI_ML_MT_CONNECTOR
    file_manager = FileUtility(credential_manager=credential_server,
                               host=file_server['ip'], port=file_server['port'], api_version=file_server['version'])

    # upload model
    file_type = "model"
    upload_file_path = f"""{input}/model.zip"""
    print("model_uid:"+model_uid)
    file_manager.upload(
        file_type=file_type,
        file_path=model_uid,
        file={'file': open(upload_file_path, 'rb')}
    )

download_optimize_files_op = func_to_container_op(
    download_optimize_files, base_image=img_name_map["download_optimize_files"])
optimize_op = func_to_container_op(
    optimize, base_image=img_name_map["optimize"])
upload_model_op = func_to_container_op(
    upload_model, base_image=img_name_map["upload_model"])

@dsl.pipeline(
    name='pipeline',
    description='pipeline example'
)
def pipeline(optimization_task_uid: str, training_dataset_uid: str, pretrain_model_uid: str, model_access_token: str, auth_server: dict, file_server: dict, model_uid: str, access_key: str, secret_key: str, config: dict):

    task1 = download_optimize_files_op(training_dataset_uid=training_dataset_uid,
                                       pretrain_model_uid=pretrain_model_uid,
                                       model_access_token=model_access_token,
                                       auth_server=auth_server,
                                       file_server=file_server,
                                       access_key=access_key,
                                       secret_key=secret_key)
    task1.set_cpu_request('0.5').set_cpu_limit('0.5')
    task1.set_memory_request('4000Mi').set_memory_limit('4000Mi')
    task1.set_ephemeral_storage_request('1Gi').set_ephemeral_storage_limit('2Gi')
    task1.set_caching_options(False)
    task1.set_image_pull_policy('Always')
    task1.add_pod_label(optimization_task_uid, 'download_optimize_files')

    task2 = optimize_op(input=task1.output, config=config)
    {{HARDWARE_SETTINGS}}
    task2.set_caching_options(False)
    task2.set_image_pull_policy('Always')
    task2.add_pod_label(optimization_task_uid, 'optimize')

    task3 = upload_model_op(input=task2.output, model_uid=model_uid,
                            auth_server=auth_server, file_server=file_server, access_key=access_key, secret_key=secret_key)
    task3.set_cpu_request('0.5').set_cpu_limit('0.5')
    task3.set_memory_request('4000Mi').set_memory_limit('4000Mi')
    task3.set_ephemeral_storage_request('1Gi').set_ephemeral_storage_limit('2Gi')
    task3.set_caching_options(False)
    task3.set_image_pull_policy('Always')
    task3.add_pod_label(optimization_task_uid, 'upload_model')

if __name__ == '__main__':
    kfp.compiler.Compiler().compile(pipeline, 'pipeline.yaml')
`,

      evaluation: `# EVALUATION Pipeline Code
# Created on ${timestamp}

import kfp
from kfp import dsl
import kfp.components as components
from kfp.components import func_to_container_op

# Define component functions
def download_evaluation_files(output: components.OutputPath(), evaluation_dataset_path: str, model_uid: str,
                              model_access_token: str, auth_server: dict, file_server: dict, access_key: str, secret_key: str):
    import os
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.file import FileUtility

    credential_server = CredentialServer(
        host=auth_server['ip'],
        port=auth_server['port'],
        access_key=access_key,
        secret_key=secret_key,
        api_version=auth_server['version']
    )
    file_manager = FileUtility(credential_manager=credential_server, host=file_server['ip'], port=file_server['port'], api_version=file_server['version'])

    # download testing dataset
    downloaded_dataset = file_manager.download(
        file_type="dataset", file_path=evaluation_dataset_path)

    # download pretrain model
    pretrain_model = file_manager.download(
        file_type="model",
        model_uid=model_uid,
        model_access_token=model_access_token
    )

    # save download testing dataset and pretrain model to output path
    download_folder_path = output
    download_dataset_path = f"""{output}/testing_dataset.zip"""
    download_model_path = f"""{output}/pretrain_model.zip"""
    os.makedirs(download_folder_path, exist_ok=True)
    with open(download_dataset_path, "wb") as file:
        file.write(downloaded_dataset.content)
    with open(download_model_path, "wb") as file:
        file.write(pretrain_model.content)

def evaluation(input: components.InputPath(), output: components.OutputPath(), config: dict):
    import os
    import json
    from mitlab_aiml_tools.pipeline.compress import CompressionUtility

    print('Your config input is =>', config)

    ############################# User config insert here #############################
    testing_dataset_filetype = "npy"
    input_model_filetype = "h5"
    metrics_type = "accuracy"
    ####################################### End #######################################

    ############################# User import insert here #############################
    import numpy as np
    from sklearn.model_selection import train_test_split
    {{USER_IMPORTS}}
    ####################################### End #######################################

    # decompress testing dataset and pretrain model in input path
    testing_dataset_input_path = f"""{input}/testing_dataset.zip"""
    pretrain_model_input_path = f"""{input}/pretrain_model.zip"""
    testing_dataset_folder_path = "./testing_dataset/"
    pretrain_model_folder_path = "./pretrain_model/"
    testing_dataset_file_path = f"./testing_dataset/testing_dataset.{testing_dataset_filetype}"
    pretrain_model_file_path = f"./pretrain_model/model.{input_model_filetype}"

    os.makedirs(testing_dataset_folder_path, exist_ok=True)
    CompressionUtility.decompress(
        compressed_file_path=testing_dataset_input_path, extract_path=testing_dataset_folder_path)

    os.makedirs(pretrain_model_folder_path, exist_ok=True)
    CompressionUtility.decompress(
        compressed_file_path=pretrain_model_input_path, extract_path=pretrain_model_folder_path)

    ############################## User code insert here ##############################
    {{USER_EVALUATION_CODE}}
    ####################################### End #######################################

    filename = f"""{output}/metrics"""
    folder_path = output
    os.makedirs(folder_path, exist_ok=True)

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(metrics_value, f, ensure_ascii=False, indent=4)

def upload_metrics(input: components.InputPath(), model_uid: str, auth_server: dict, metrics_server: dict, access_key: str,
                   secret_key: str):
    from mitlab_aiml_tools.auth.credential import CredentialServer
    from mitlab_aiml_tools.pipeline.metrics import MetricUtility
    import json

    ############################# User config insert here #############################
    {{USER_METRICS_CONFIG}}
    ####################################### End #######################################

    # initial credential
    credential_server = CredentialServer(
        host=auth_server['ip'],
        port=auth_server['port'],
        access_key=access_key,
        secret_key=secret_key,
        api_version=auth_server['version']
    )
    print(credential_server)
    metric_manager = MetricUtility(credential_manager=credential_server, host=metrics_server['ip'], port=metrics_server['port'], api_version=metrics_server['version'])

    metrics_file_path = f"""{input}/metrics"""

    with open(metrics_file_path, 'r') as f:
        metrics = json.load(f)

    # upload metrics
    print('Metrics will be uploaded to', model_uid)
    r = metric_manager.upload_accuracy(
        model_uid=model_uid,
        model_accuracy=metrics[metrics_type]
    )
    print(r)

download_evaluation_files_op = func_to_container_op(
    download_evaluation_files, base_image=img_name_map["download_evaluation_files"])
evaluation_op = func_to_container_op(
    evaluation, base_image=img_name_map["evaluation"])
upload_metrics_op = func_to_container_op(
    upload_metrics, base_image=img_name_map["upload_metrics"])

@dsl.pipeline(
    name='pipeline',
    description='pipeline example'
)
def pipeline(evaluation_task_uid: str, evaluation_dataset_path: str, model_uid: str, model_access_token: str, auth_server: dict, file_server: dict,
            metrics_server: dict, access_key: str, secret_key: str, config: dict):
    
    task1 = download_evaluation_files_op(evaluation_dataset_path=evaluation_dataset_path,
                                         model_uid=model_uid,
                                         model_access_token=model_access_token,
                                         auth_server=auth_server,
                                         file_server=file_server,
                                         access_key=access_key,
                                         secret_key=secret_key)
    task1.set_cpu_request('0.5').set_cpu_limit('0.5')
    task1.set_memory_request('4000Mi').set_memory_limit('4000Mi')
    task1.set_ephemeral_storage_request('1Gi').set_ephemeral_storage_limit('2Gi')
    task1.set_caching_options(False)
    task1.set_image_pull_policy('Always')
    task1.add_pod_label(evaluation_task_uid, 'download_evaluation_files')

    task2 = evaluation_op(input=task1.output, config=config)
    {{HARDWARE_SETTINGS}}
    task2.set_caching_options(False)
    task2.set_image_pull_policy('Always')
    task2.add_pod_label(evaluation_task_uid, 'evaluation')

    task3 = upload_metrics_op(input=task2.output, 
                              model_uid=model_uid, 
                              auth_server=auth_server, 
                              metrics_server=metrics_server, 
                              access_key=access_key, 
                              secret_key=secret_key)
    task3.set_cpu_request('0.5').set_cpu_limit('0.5')
    task3.set_memory_request('4000Mi').set_memory_limit('4000Mi')
    task3.set_ephemeral_storage_request('1Gi').set_ephemeral_storage_limit('2Gi')
    task3.set_caching_options(False)
    task3.set_image_pull_policy('Always')
    task3.add_pod_label(evaluation_task_uid, 'upload_metrics')

if __name__ == '__main__':
    kfp.compiler.Compiler().compile(pipeline, 'pipeline.yaml')
`
    };

    return templates[pipelineType] || templates.preprocessing;
  }
};